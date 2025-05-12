import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
    onUploadAnother: () => void;
}

export const SuccessMessage = ({ onUploadAnother }: SuccessMessageProps) => {
    return (
        <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Upload Successful!</h2>
            <p className="text-gray-600 mt-2">Your video has been uploaded and saved.</p>
            <Button onClick={onUploadAnother} className="mt-4">
                Upload Another Video
            </Button>
        </div>
    );
};