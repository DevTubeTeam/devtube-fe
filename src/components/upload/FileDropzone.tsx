import { Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
    maxSize?: number; // Maximum file size in bytes, default: 1GB
    acceptedFormats?: string[]; // Array of accepted file formats
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
    onFileSelect,
    maxSize = 1024 * 1024 * 1024, // Default: 1GB
    acceptedFormats = ['.mp4', '.mov', '.avi', '.webm']
}) => {
    const [fileRejections, setFileRejections] = useState<{ file: File, reason: string }[]>([]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setFileRejections([]);

        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }

        if (rejectedFiles.length > 0) {
            const rejections = rejectedFiles.map(rejection => {
                let reason = 'Invalid file';

                if (rejection.errors) {
                    const error = rejection.errors[0];
                    if (error.code === 'file-too-large') {
                        reason = `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
                    } else if (error.code === 'file-invalid-type') {
                        reason = `Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`;
                    } else {
                        reason = error.message;
                    }
                }

                return {
                    file: rejection.file,
                    reason
                };
            });
            setFileRejections(rejections);
            rejections.forEach(rejection => {
                toast.error(`${rejection.file.name}: ${rejection.reason}`);
            });
        }
    }, [onFileSelect, maxSize, acceptedFormats]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'video/*': acceptedFormats
        },
        multiple: false,
        maxSize: maxSize
    });

    // Function to format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div
            {...getRootProps()}
            className={`
                w-full max-w-lg mx-auto flex flex-col items-center justify-center
                rounded-3xl border-2 border-dashed border-neutral-500
                bg-gradient-to-b from-neutral-900/80 to-neutral-800/80
                p-10 min-h-[260px] shadow-lg
                transition-all duration-200 cursor-pointer
                hover:border-primary hover:bg-neutral-800/90
                focus:outline-none
            `}
        >
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center mb-4 shadow">
                <Upload className="h-12 w-12 text-neutral-400" />
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-white mb-2">
                    {isDragActive ? 'Thả file vào đây...' : 'Kéo & thả hoặc click để chọn file video'}
                </p>
                <p className="text-sm text-neutral-400">
                    (Chỉ hỗ trợ: {acceptedFormats.join(', ')})
                </p>
            </div>
        </div>
    );
};
