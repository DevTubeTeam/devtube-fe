import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { useEffect, useRef } from 'react';

interface HLSVideoPlayerProps {
    source: string;
    poster?: string;
    className?: string;
}

function HLSVideoPlayer({ source, poster, className }: HLSVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const defaultOptions = {};

        if (!Hls.isSupported()) {
            video.src = source;
            new Plyr(video, defaultOptions);
        } else {
            // Create a new hls.js instance
            const hls = new Hls({
                startLevel: -1,
                maxMaxBufferLength: 30,
                maxBufferLength: 10,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                startFragPrefetch: true,
            });

            hlsRef.current = hls;
            hls.loadSource(source);

            // Handle the manifest parsing and quality selection
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                const availableQualities = hls.levels.map((l) => l.height);
                availableQualities.unshift(0);

                const options = {
                    ...defaultOptions,
                    quality: {
                        default: 0,
                        options: availableQualities,
                        forced: true,
                        onChange: (e: number) => updateQuality(e),
                    },
                    i18n: {
                        qualityLabel: { 0: 'Auto' },
                    },
                };

                hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
                    const span = document.querySelector(
                        ".plyr__menu__container [data-plyr='quality'][value='0'] span"
                    );
                    if (span) {
                        if (hls.autoLevelEnabled) {
                            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
                        } else {
                            span.innerHTML = `AUTO`;
                        }
                    }
                });

                new Plyr(video, options);
            });

            hls.attachMedia(video);

            // Limit the number of segments preloaded in the buffer
            hls.on(Hls.Events.FRAG_LOADING, function (event, data) {
                const currentTime = video.currentTime;
                const maxBufferedTime = 10;

                if (data.frag && typeof data.frag.startPTS === 'number') {
                    if (data.frag.startPTS > currentTime + maxBufferedTime) {
                        hls.stopLoad();
                    }
                }
            });

            // Continue loading fragments when playback nears the end
            hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
                const currentTime = video.currentTime;
                const buffered = video.buffered;
                let bufferLength = 0;

                if (buffered.length > 0) {
                    for (let i = 0; i < buffered.length; i++) {
                        if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                            bufferLength = buffered.end(i) - currentTime;
                            break;
                        }
                    }
                }

                if (bufferLength < 10) {
                    hls.startLoad();
                }
            });
        }

        function updateQuality(newQuality: number) {
            if (!hlsRef.current) return;

            if (newQuality === 0) {
                hlsRef.current.currentLevel = -1;
            } else {
                hlsRef.current.levels.forEach((level, levelIndex) => {
                    if (level.height === newQuality) {
                        hlsRef.current!.currentLevel = levelIndex;
                    }
                });
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
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