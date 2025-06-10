import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    acceptedFormats = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm']
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
            }); setFileRejections(rejections);
            rejections.forEach(rejection => {
                if (typeof toast !== 'undefined') {
                    toast.error(`${rejection.file.name}: ${rejection.reason}`);
                } else {
                    console.error(`${rejection.file.name}: ${rejection.reason}`);
                }
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

    // Calculate dropzone state
    const getDropzoneClassName = () => {
        let className = "p-8 border-2 border-dashed rounded-lg transition-colors duration-200";

        if (isDragActive && !isDragReject) {
            className += " border-primary bg-primary/10";
        } else if (isDragReject) {
            className += " border-destructive bg-destructive/10";
        } else {
            className += " border-muted-foreground/30 hover:border-muted-foreground/50";
        }

        return className;
    };

    return (
        <Card className="w-full overflow-hidden">
            <div
                className={getDropzoneClassName() + " flex flex-col items-center justify-center space-y-4 min-h-[280px]"}
                {...getRootProps()}
            >
                <input {...getInputProps()} />

                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                </div>

                <div className="text-center">
                    {isDragActive ? (
                        <p className="text-lg font-medium">Thả file video vào đây...</p>
                    ) : (
                        <>
                            <p className="text-lg font-medium">Kéo và thả file video hoặc</p>
                            <Button type="button" variant="secondary" className="mt-4">
                                Chọn File
                            </Button>
                        </>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                        Hỗ trợ định dạng: {acceptedFormats.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Kích thước tối đa: {formatFileSize(maxSize)}
                    </p>
                </div>

                {fileRejections.length > 0 && (
                    <div className="text-destructive text-sm mt-2">
                        {fileRejections.map((rejection, index) => (
                            <p key={index}>{rejection.file.name}: {rejection.reason}</p>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};
