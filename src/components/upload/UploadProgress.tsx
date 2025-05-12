import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
    progress: number;
    onCancel: () => void;
}

export const UploadProgress = ({ progress, onCancel }: UploadProgressProps) => {
    return (
        <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">Uploading: {progress}%</p>
            <Button variant="destructive" onClick={onCancel} className="mt-2">
                Cancel
            </Button>
        </div>
    );
};