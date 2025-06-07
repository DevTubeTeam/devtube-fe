import { Progress } from '@/components/ui/progress';
import React from 'react';

interface UploadProgressProps {
    progress: number;
    processingStage?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
    progress,
    processingStage,
}) => {
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                    {progress < 100
                        ? `Uploading... ${Math.round(progress)}%`
                        : processingStage || 'Processing video...'}
                </span>
                <span>
                    {progress < 100 ? `${Math.round(progress)}%` : '100%'}
                </span>
            </div>
            <Progress value={progress} className="h-1" />
        </div>
    );
};
