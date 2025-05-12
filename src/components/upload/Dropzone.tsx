import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
}

export const Dropzone = ({ onDrop }: DropzoneProps) => {
    const onDropAccepted = useCallback((acceptedFiles: File[]) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        accept: { 'video/*': [] },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
        >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <Label className="mt-2 block text-sm font-medium text-gray-700">
                {isDragActive
                    ? 'Drop the video here'
                    : 'Drag & drop a video or click to select'}
            </Label>
            <p className="mt-1 text-xs text-gray-500">Only video files are supported</p>
        </div>
    );
};