import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VidPrivacy } from '@/types/video';
import { EyeOff, Globe, Lock } from 'lucide-react';
import React from 'react';

interface VisibilitySelectorProps {
    value: number;
    onChange: (value: number) => void;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
    value,
    onChange,
}) => {

    console.log(value)
    return (
        <RadioGroup
            value={String(value)}
            onValueChange={(val) => onChange(Number(val))}
            className="space-y-3"
        >
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-muted hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value={String(VidPrivacy.PRIVATE)} id="private" className="mt-1" />
                <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="private" className="font-medium cursor-pointer">Private</Label>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Only you and people you choose can watch your video
                    </p>
                </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-muted hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value={String(VidPrivacy.UNLISTED)} id="unlisted" className="mt-1" />
                <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="unlisted" className="font-medium cursor-pointer">Unlisted</Label>
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Anyone with the link can watch your video
                    </p>
                </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-muted hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value={String(VidPrivacy.PUBLIC)} id="public" className="mt-1" />
                <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="public" className="font-medium cursor-pointer">Public</Label>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Everyone can watch your video
                    </p>
                </div>
            </div>
        </RadioGroup>
    );
};
