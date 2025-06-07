import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ThumbnailSelectorProps {
    videoFile: File | null;
    currentThumbnail: string;
    onChange: (thumbnailUrl: string) => void;
}

export const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({
    videoFile,
    currentThumbnail,
    onChange,
}) => {
    const [thumbnailOptions, setThumbnailOptions] = useState<string[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string>(currentThumbnail);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // In a real implementation, these would be generated from the video
    // For now, we'll use placeholders
    const generateThumbnails = () => {
        // Mock thumbnails - in a real app these would be generated from the video
        const mockThumbnails = [
            'https://via.placeholder.com/320x180/6366f1/ffffff?text=Thumbnail+1',
            'https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Thumbnail+2',
            'https://via.placeholder.com/320x180/ec4899/ffffff?text=Thumbnail+3',
        ];

        setThumbnailOptions(mockThumbnails);
        if (!selectedThumbnail && mockThumbnails.length > 0) {
            setSelectedThumbnail(mockThumbnails[0]);
            onChange(mockThumbnails[0]);
        }
    };

    // Generate thumbnails when video file changes
    React.useEffect(() => {
        if (videoFile) {
            generateThumbnails();
        }
    }, [videoFile]);

    const handleThumbnailSelect = (url: string) => {
        setSelectedThumbnail(url);
        onChange(url);
    };

    const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setSelectedThumbnail(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Preview of selected thumbnail */}
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

            {/* Thumbnail options */}
            <div className="flex flex-wrap gap-2 justify-center">
                {thumbnailOptions.map((url, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleThumbnailSelect(url)}
                        className={`w-20 h-12 rounded-md overflow-hidden border-2 transition-all ${selectedThumbnail === url ? 'border-primary' : 'border-transparent'
                            }`}
                    >
                        <img src={url} alt={`Thumbnail option ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}

                {/* Custom upload button */}
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
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};
