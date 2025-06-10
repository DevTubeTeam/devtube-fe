import { Button } from '@/components/ui/button';
import { IVideoFile } from '@/types/video';
import { Image as ImageIcon, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface ThumbnailSelectorProps {
    videoFile: IVideoFile | null;
    currentThumbnail: string;
    onChange: (thumbnailUrl: string) => void;
    onUpload: (file: File) => void;
}

export const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({
    videoFile,
    currentThumbnail,
    onChange,
    onUpload
}) => {
    const [thumbnailOptions, setThumbnailOptions] = useState<string[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string>(currentThumbnail);
    const fileInputRef = useRef<HTMLInputElement>(null);    // Generate thumbnails from video file or use placeholders if not possible
    const generateThumbnails = async () => {
        if (videoFile && videoFile.type.startsWith('video/')) {
            try {
                // Create video element to extract frames
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.src = URL.createObjectURL(videoFile);

                await new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        resolve(null);
                    };
                });

                // Generate thumbnails from different points in the video
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const thumbnails: string[] = [];

                if (context) {
                    // Set canvas dimensions
                    canvas.width = 320;
                    canvas.height = 180;

                    // Generate thumbnails at 25%, 50%, and 75% of the video
                    const timestamps = [0.25, 0.5, 0.75];

                    for (const timePercent of timestamps) {
                        video.currentTime = video.duration * timePercent;

                        await new Promise((resolve) => {
                            video.onseeked = () => {
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                                thumbnails.push(canvas.toDataURL('image/jpeg'));
                                resolve(null);
                            };
                        });
                    }
                }

                if (thumbnails.length > 0) {
                    setThumbnailOptions(thumbnails);
                    if (!selectedThumbnail) {
                        setSelectedThumbnail(thumbnails[0]);
                        onChange(thumbnails[0]);
                    }
                    URL.revokeObjectURL(video.src);
                    return;
                }
            } catch (error) {
                console.error('Error generating thumbnails:', error);
            }
        }

        // Fallback to placeholders if thumbnail generation fails
        const placeholders = [
            'https://placehold.co/320x180/6366f1/fff?text=Thumbnail+1',
            'https://placehold.co/320x180/8b5cf6/fff?text=Thumbnail+2',
            'https://placehold.co/320x180/ec4899/fff?text=Thumbnail+3'
        ];
        setThumbnailOptions(placeholders);
        if (!selectedThumbnail && placeholders.length > 0) {
            setSelectedThumbnail(placeholders[0]);
            onChange(placeholders[0]);
        }
    }; useEffect(() => {
        if (videoFile) {
            generateThumbnails();
        }
    }, [videoFile]);

    // Re-trigger thumbnail upload if s3Key becomes available
    useEffect(() => {
        if (videoFile?.s3Key && !currentThumbnail.startsWith('http')) {
            // If we have a non-HTTP thumbnail (a data URL from local file) and s3Key
            // is now available, we should upload the thumbnail to the server
            const fileInputEl = fileInputRef.current;
            if (fileInputEl && fileInputEl.files && fileInputEl.files.length > 0) {
                const thumbnailFile = fileInputEl.files[0];
                const videoId = videoFile.s3Key.split('/').pop();
                if (videoId) {
                    onUpload(thumbnailFile);
                }
            }
        }
    }, [videoFile?.s3Key, currentThumbnail, onUpload]);

    const handleThumbnailSelect = (url: string) => {
        setSelectedThumbnail(url);
        onChange(url);
    }; const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Create a preview
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setSelectedThumbnail(result);
            onChange(result);

            // Try to upload if videoFile has s3Key
            if (videoFile?.s3Key) {
                const videoId = videoFile.s3Key.split('/').pop();
                if (videoId) {
                    onUpload(file);
                } else {
                    toast.warn('Waiting for video upload to complete before uploading thumbnail');
                }
            } else {
                // Store the file for later upload
                onUpload(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-md bg-secondary">
                {selectedThumbnail ? (
                    <img
                        src={selectedThumbnail}
                        alt="Selected thumbnail"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {thumbnailOptions.map((url, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleThumbnailSelect(url)}
                        className={`w-20 h-12 rounded-md overflow-hidden border-2 transition-all ${selectedThumbnail === url ? 'border-primary' : 'border-transparent'
                            }`}
                    >
                        <img
                            src={url}
                            alt={`Thumbnail option ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="flex items-center gap-1"
                >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                </Button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCustomThumbnailUpload}
                    accept="image/jpeg,image/png,image/gif"
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};