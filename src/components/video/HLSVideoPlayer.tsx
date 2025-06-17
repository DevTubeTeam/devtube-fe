import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { useEffect, useRef, useState } from 'react';

interface HLSVideoPlayerProps {
    source: string;
    poster?: string;
    className?: string;
}

function HLSVideoPlayer({ source, poster, className }: HLSVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
    const [availableLevels, setAvailableLevels] = useState<{ label: string; levelIndex: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = auto
    const playerRef = useRef<Plyr | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        let hls: Hls | null = null;

        if (video) {
            if (Hls.isSupported()) {
                hls = new Hls({
                    startLevel: -1,
                    maxMaxBufferLength: 30,
                    maxBufferLength: 10,
                    maxBufferSize: 60 * 1000 * 1000,
                    maxBufferHole: 0.5,
                    startFragPrefetch: true,
                });

                hls.loadSource(source);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // Log available levels for debugging
                    console.log('Available levels:', hls?.levels);

                    const levels = hls?.levels.map((level, i) => ({
                        label: `${level.height}p`,
                        levelIndex: i,
                    })) || [];

                    setAvailableLevels([{ label: 'Auto', levelIndex: -1 }, ...levels]);

                    // Create quality labels object dynamically
                    const qualityLabels: Record<number, string> = {
                        0: 'Auto'
                    };
                    levels.forEach(level => {
                        qualityLabels[level.levelIndex] = level.label;
                    });

                    // Initialize Plyr with quality options
                    const options = {
                        controls: [
                            'play-large',
                            'play',
                            'progress',
                            'current-time',
                            'mute',
                            'volume',
                            'captions',
                            'settings',
                            'pip',
                            'airplay',
                            'fullscreen'
                        ],
                        quality: {
                            default: 0,
                            options: levels.map(l => l.levelIndex),
                            forced: true,
                            onChange: (quality: number) => {
                                if (hls) {
                                    hls.currentLevel = quality;
                                    setCurrentLevel(quality);
                                }
                            },
                        },
                        i18n: {
                            qualityLabel: qualityLabels,
                        },
                    };

                    const player = new Plyr(video, options);
                    playerRef.current = player;

                    // Update quality label when level changes
                    hls?.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                        const span = document.querySelector(
                            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
                        );
                        if (span && hls?.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level]?.height}p)`;
                        }
                    });
                });

                setHlsInstance(hls);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                const player = new Plyr(video);
                playerRef.current = player;
            }
        }

        return () => {
            hls?.destroy();
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [source]);

    return (
        <div className={`w-full h-full ${className}`}>
            <video
                ref={videoRef}
                controls
                crossOrigin="anonymous"
                playsInline
                poster={poster}
                className="w-full h-full rounded-lg shadow-lg object-contain bg-black"
            >
                <p>
                    Your browser doesn't support HLS playback. Please use a compatible browser or download the
                    video.
                </p>
            </video>
        </div>
    );
}

export default HLSVideoPlayer;