import { useUpload } from "@/hooks/useUpload";
import { UploadParams, UploadResult } from "@/types/upload";
import { IVideoFile, IVideoMetadata } from "@/types/video";
import { UseMutationResult } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface UploadContextType {
    file: IVideoFile | null;
    setFile: (file: IVideoFile) => void;
    uploadProgress: number;
    s3Key: string | null;
    uploadId: string | null;
    setS3Info: (s3Key: string, uploadId: string) => void;
    metadata: IVideoMetadata | null;
    setMetadata: (metadata: IVideoMetadata) => void;
    idToken: string | null;
    setIdToken: (token: string) => void;
    error: string | null;
    setError: (error: string | null) => void;
    status: 'idle' | 'uploading' | 'success' | 'error';
    setStatus: (status: 'idle' | 'uploading' | 'success' | 'error') => void;
    reset: () => void;
    cancelUpload: () => void;
    useUploadVideo: UseMutationResult<UploadResult, Error, UploadParams, unknown>;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
    const [file, setFile] = useState<IVideoFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [s3Key, setS3Key] = useState<string | null>(null);
    const [uploadId, setUploadId] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<IVideoMetadata | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const { useUploadVideo, useCancelUpload } = useUpload({
        onProgress: (progress) => {
            setUploadProgress(progress);
            if (progress === 100) {
                setStatus('success');
            }
        },
    });

    const setFileCallback = useCallback((file: IVideoFile) => {
        setFile(file);
        setStatus('idle');
        setError(null);
    }, []);

    const setS3Info = useCallback((key: string, id: string) => {
        setS3Key(key);
        setUploadId(id);
    }, []);

    const setMetadataCallback = useCallback((metadata: IVideoMetadata) => {
        setMetadata(metadata);
    }, []);

    const setIdTokenCallback = useCallback((token: string) => {
        setIdToken(token);
        setError(null);
    }, []);

    const setErrorCallback = useCallback((error: string | null) => {
        setError(error);
        if (error) {
            setStatus('error');
        }
    }, []);

    const setStatusCallback = useCallback((status: 'idle' | 'uploading' | 'success' | 'error') => {
        setStatus(status);
        if (status === 'error') {
            setUploadProgress(0);
        }
    }, []);

    const reset = useCallback(() => {
        setFile(null);
        setUploadProgress(0);
        setS3Key(null);
        setUploadId(null);
        setMetadata(null);
        setIdToken(null);
        setError(null);
        setStatus('idle');
    }, []);

    const cancelUpload = useCallback(async () => {
        if (!file || !idToken) {
            setError('Cannot cancel upload: missing required information');
            setStatus('error');
            return;
        }

        try {
            await useCancelUpload(file, idToken);
            setError('Upload cancelled by user');
            setStatus('error');
            setUploadProgress(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel upload');
            setStatus('error');
        }
    }, [file, idToken, useCancelUpload]);

    const value = {
        file,
        setFile: setFileCallback,
        uploadProgress,
        s3Key,
        uploadId,
        setS3Info,
        metadata,
        setMetadata: setMetadataCallback,
        idToken,
        setIdToken: setIdTokenCallback,
        error,
        setError: setErrorCallback,
        status,
        setStatus: setStatusCallback,
        reset,
        cancelUpload,
        useUploadVideo,
    };

    return (
        <UploadContext.Provider value={value}>
            {children}
        </UploadContext.Provider>
    );
}

export function useUploadContext() {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error('useUploadContext must be used within an UploadProvider');
    }
    return context;
}