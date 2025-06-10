import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VidPrivacy } from '@/types/video';
import { CheckCircle, Copy, ExternalLink, Share2 } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';

interface UploadCompleteProps {
    videoData: {
        title: string;
        thumbnailUrl: string;
        privacy: VidPrivacy;
        videoUrl: string;
    };
    videoId?: string;
    onClose: () => void;
}

export const UploadComplete: React.FC<UploadCompleteProps> = ({ videoData, videoId, onClose }) => {
    const videoUrl = videoData.videoUrl || `https://devtube.example.com/watch?v=${videoId || ''}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(videoUrl);
        toast.success('Link copied to clipboard!');
    };

    const getStatusMessage = () => {
        switch (videoData.privacy) {
            case VidPrivacy.PUBLIC:
                return 'Your video is now public and ready to be viewed!';
            case VidPrivacy.UNLISTED:
                return 'Your video is ready. Only people with the link can view it.';
            case VidPrivacy.PRIVATE:
                return 'Your video is private. Only you can view it.';
            default:
                return 'Your video has been uploaded successfully!';
        }
    };

    return (
        <div className="py-6 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Video uploaded successfully!</h3>
                <p className="text-muted-foreground max-w-md">{getStatusMessage()}</p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="w-24 h-14 rounded-md overflow-hidden flex-shrink-0">
                    {videoData.thumbnailUrl ? (
                        <img
                            src={videoData.thumbnailUrl}
                            alt={videoData.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No thumbnail</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{videoData.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                        {VidPrivacy[videoData.privacy].toLowerCase()}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Input value={videoUrl} readOnly className="flex-1" />
                    <Button variant="outline" size="icon" onClick={handleCopyLink} title="Copy link">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(videoUrl, '_blank')}
                    >
                        <ExternalLink className="h-4 w-4" />
                        Watch video
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            <div className="border-t pt-4 flex justify-end">
                <Button onClick={onClose}>Done</Button>
            </div>
        </div>
    );
};