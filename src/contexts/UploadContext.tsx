import { useSmoothProgress } from "@/hooks/useSmoothProgress";
import { UploadOptions, UploadParams, UploadResult, useUpload, VideoProcessingStatus } from "@/hooks/useUpload";
import { IGetVideoStatusResponse, IPublishVideoResponse, IUpdateVideoMetadataRequest, IVideoFile, IVideoMetadata, VideoLifecycle, VidPrivacy, VidStatus } from "@/types/video";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { IUpdateThumbnailResponse } from "../types/upload";

interface UploadState {
    file: IVideoFile | null;
    uploadProgress: number;
    smoothUploadProgress: number; // Smooth progress for UI
    s3Key: string | null;
    uploadId: string | null;
    metadata: IVideoMetadata | null;
    thumbnail: File | null;
    error: string | null;
    processingStatus: VideoProcessingStatus;
    canSaveMetadata: boolean;
}

interface UploadActions {
    setFile: (file: IVideoFile) => void;
    setS3Info: (s3Key: string, uploadId: string) => void;
    setMetadata: (metadata: IVideoMetadata) => void;
    setThumbnail: (thumbnail: File) => void;
    setError: (error: string | null) => void;
    reset: () => void;
    cancelCurrentUpload: () => Promise<boolean>;
    setCanSaveMetadata: (canSave: boolean) => void;
}

interface UploadAPI {
    uploadVideo: UseMutationResult<UploadResult, Error, UploadParams, unknown>;
    uploadThumbnail: UseMutationResult<IUpdateThumbnailResponse, Error, { videoId: string; thumbnail: File }, unknown>;
    publishVideo: UseMutationResult<IPublishVideoResponse, Error, { videoId: string; publishAt?: string }, unknown>;
    cancelUpload: UseMutationResult<boolean, Error, IVideoFile, unknown>;
    deleteVideo: UseMutationResult<boolean, Error, string, unknown>;
    updateVideoMetadata: UseMutationResult<any, Error, { videoId: string; metadata: IUpdateVideoMetadataRequest }, unknown>;
    useVideoStatus: (videoId: string, enabled?: boolean, pollingInterval?: number) => UseQueryResult<IGetVideoStatusResponse, Error>;
    useGetVideoById: (videoId: string, enabled?: boolean) => UseQueryResult<any, Error>;
}


interface UploadContextType extends UploadState, UploadActions, UploadAPI {
    isUploading: boolean;
}


const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {

    const [file, setFileState] = useState<IVideoFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [s3Key, setS3Key] = useState<string | null>(null);
    const [uploadId, setUploadId] = useState<string | null>(null);
    const [metadata, setMetadataState] = useState<IVideoMetadata | null>(null);
    const [thumbnail, setThumbnailState] = useState<File | null>(null);
    const [error, setErrorState] = useState<string | null>(null);
    const [processingStatus, setProcessingStatus] = useState<VideoProcessingStatus>('pending');
    const [canSaveMetadata, setCanSaveMetadata] = useState<boolean>(false);

    // Sử dụng hook smoothProgress mới
    const {
        smoothProgress: smoothUploadProgress,
        updateProgress,
        setPhase,
        resetProgress
    } = useSmoothProgress({
        initialValue: 0,
        minStep: 0.5,
        maxStep: 2,
        smoothingFactor: 0.8
    }); const handleOnProgress = useCallback((progress: number) => {
        setUploadProgress(progress);
        // Cập nhật progress mượt mà
        updateProgress(progress);
    }, [updateProgress]); const handleOnSuccess = useCallback((result: UploadResult) => {
        setErrorState(null);

        if (result) {
            // Cập nhật thông tin từ videoFile
            if (result.videoFile?.s3Key && result.videoFile?.uploadId) {
                setS3Key(result.videoFile.s3Key);
                setUploadId(result.videoFile.uploadId);
            }

            if (result.videoId) {
                // Cập nhật metadata với videoId
                setMetadataState(prev => {
                    const defaultMetadata: IVideoMetadata = {
                        id: result.videoId,
                        userId: '',
                        title: '',
                        description: '',
                        tags: [],
                        category: '',
                        videoUrl: '',
                        thumbnailUrl: '',
                        resolution: '',
                        duration: 0,
                        privacy: VidPrivacy.PRIVATE,
                        status: VidStatus.PROCESSING,
                        views: 0,
                        publishAt: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        lifecycle: VideoLifecycle.DRAFT
                    };

                    if (prev === null) {
                        return defaultMetadata;
                    } else {
                        return {
                            ...prev,
                            videoId: result.videoId
                        };
                    }
                });
            }

            // Cho phép lưu metadata khi upload thành công
            setCanSaveMetadata(true);
            setProcessingStatus('processing');
        }

        console.log('Upload thành công:', result);
    }, []);

    const handleOnError = useCallback((error: Error) => {
        setErrorState(error.message);
        setCanSaveMetadata(false);
    }, []); const handleOnStatusChange = useCallback((status: VideoProcessingStatus, videoId?: string) => {
        setProcessingStatus(status);

        if (status === 'uploading' && videoId && file) {
            // Only set S3 info if file has these properties
            if (file.s3Key && file.uploadId) {
                setS3Key(file.s3Key);
                setUploadId(file.uploadId);
            }
            // Set upload phase
            setPhase('uploading');
        }

        if (status === 'failed' || status === 'cancelled') {
            setErrorState(`Video ${videoId || ''} ${status}`);
            setCanSaveMetadata(false);
            // Reset progress animation
            resetProgress();
        } else if (status === 'uploading') {
            setErrorState(null);
            // Set upload phase
            setPhase('uploading');
        } else if (status === 'processing') {
            // Set processing phase
            setPhase('processing');
        }

        // Chỉ cho phép lưu metadata khi video đã sẵn sàng
        if (status === 'ready') {
            setCanSaveMetadata(true);
            // Set complete phase
            setPhase('complete');
        }
    }, [file, setPhase, resetProgress]);

    const uploadOptions: UploadOptions = {
        onProgress: handleOnProgress,
        onStatusChange: handleOnStatusChange,
        onError: handleOnError,
        onSuccess: handleOnSuccess
    };

    const {
        uploadVideo,
        uploadThumbnail,
        publishVideo,
        cancelUpload,
        deleteVideo,
        updateVideoMetadata,
        useVideoStatus,
        useGetVideoById
    } = useUpload(uploadOptions);

    // Định nghĩa các actions
    const setFile = useCallback((newFile: IVideoFile) => {
        setFileState(newFile);
        setProcessingStatus('pending');
        setErrorState(null);
        setCanSaveMetadata(false);
    }, []);

    const setS3Info = useCallback((key: string, id: string) => {
        setS3Key(key);
        setUploadId(id);
    }, []);

    const setMetadata = useCallback((newMetadata: IVideoMetadata) => {
        setMetadataState(newMetadata);
    }, []);

    const setThumbnail = useCallback((newThumbnail: File) => {
        setThumbnailState(newThumbnail);

        // Upload thumbnail nếu đã có videoId
        if (file?.s3Key) {
            const videoId = file.s3Key.split('/').pop() || '';
            if (videoId) {
                uploadThumbnail.mutate({ videoId, thumbnail: newThumbnail });
            }
        }
    }, [file, uploadThumbnail]);

    const setError = useCallback((newError: string | null) => {
        setErrorState(newError);
    }, []); const reset = useCallback(() => {
        setFileState(null);
        setUploadProgress(0);
        setS3Key(null);
        setUploadId(null);
        setMetadataState(null);
        setThumbnailState(null);
        setErrorState(null);
        setProcessingStatus('pending');
        setCanSaveMetadata(false);

        // Reset smooth progress
        resetProgress();
    }, [resetProgress]);

    const cancelCurrentUpload = useCallback(async () => {
        if (!file || !file.s3Key || !file.uploadId) {
            setErrorState('Không thể hủy upload: Không có file đang được upload');
            return false;
        }

        try {
            await cancelUpload.mutateAsync(file);
            setErrorState('Upload đã bị hủy bởi người dùng');
            setCanSaveMetadata(false);
            return true;
        } catch (error) {
            setErrorState(error instanceof Error ? error.message : 'Không thể hủy upload');
            return false;
        }
    }, [file, cancelUpload]);    // Xác định xem có đang trong quá trình upload không
    const isUploading = processingStatus === 'uploading' || uploadVideo.isPending;

    const value: UploadContextType = {
        // State
        file,
        uploadProgress,
        smoothUploadProgress,
        s3Key,
        uploadId,
        metadata,
        thumbnail,
        error,
        processingStatus,
        canSaveMetadata,
        isUploading,

        // Actions
        setFile,
        setS3Info,
        setMetadata,
        setThumbnail,
        setError,
        reset,
        cancelCurrentUpload,
        setCanSaveMetadata,

        // API
        uploadVideo,
        uploadThumbnail,
        publishVideo,
        cancelUpload,
        deleteVideo,
        updateVideoMetadata,
        useVideoStatus,
        useGetVideoById
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