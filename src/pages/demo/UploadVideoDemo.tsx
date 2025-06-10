import { Button } from '@/components/ui/button';
import { UploadVideoModal } from '@/components/upload';
import { UploadProvider } from '@/contexts/UploadContext';
import { useState } from 'react';

export default function UploadVideoDemo() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <UploadProvider>
            <div className="container mx-auto p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">Demo Upload Video</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Flow upload video 2 bước: Chọn file và nhập metadata
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Upload Video
                    </Button>
                </div>

                <UploadVideoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </UploadProvider>
    );
}
