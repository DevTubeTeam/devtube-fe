import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface VideoPlayerPreviewProps {
    source: string;
    poster?: string;
    className?: string;
}

const VideoPlayerPreview = ({ source, poster, className }: VideoPlayerPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        let hls: Hls | null = null;

        if (video && source.endsWith('.m3u8') && Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
        } else if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (video) {
            video.src = source;
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [source]);

    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow ${className || ''}`}>
            <video
                ref={videoRef}
                controls
                poster={poster}
                className="w-full h-full object-contain bg-black"
                preload="metadata"
            />
            <div className="absolute top-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                Preview
            </div>
        </div>
    );
};

export default VideoPlayerPreview;
