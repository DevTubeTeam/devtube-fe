import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Plus, Video } from 'lucide-react';
import React from 'react';

interface UploadButtonProps {
    onUploadVideo: () => void;
    onGoLive?: () => void;
    showGoLive?: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
    onUploadVideo,
    onGoLive,
    showGoLive = false,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Plus className="h-5 w-5" />
                    <Video className="h-4 w-4 absolute bottom-0 right-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onUploadVideo}>
                    Upload video
                </DropdownMenuItem>
                {showGoLive && onGoLive && (
                    <DropdownMenuItem onClick={onGoLive}>
                        Go live
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
