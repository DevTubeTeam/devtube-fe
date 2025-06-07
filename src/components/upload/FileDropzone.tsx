import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    onFileSelect: (files: File[]) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect }) => {
    // const [dragActive, setDragActive] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter for video files
        const videoFiles = acceptedFiles.filter(file =>
            file.type.startsWith('video/') ||
            /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(file.name)
        );

        if (videoFiles.length > 0) {
            onFileSelect(videoFiles);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv']
        },
        multiple: true
    });

    return (
        <div
            className={`p-8 border-2 border-dashed rounded-lg ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'
                } transition-colors duration-200 flex flex-col items-center justify-center space-y-4 min-h-[300px]`}
            {...getRootProps()}
        >
            <input {...getInputProps()} />

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center">
                <p className="text-lg font-medium">Drag and drop video files to upload</p>
                <p className="text-sm text-muted-foreground">Your videos will be private until you publish them</p>
            </div>

            <Button type="button" className="mt-4">
                Select Files
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
                By submitting your videos to DevTube, you acknowledge that you agree to DevTube's Terms of Service and Community Guidelines.
            </p>
        </div>
    );
};
