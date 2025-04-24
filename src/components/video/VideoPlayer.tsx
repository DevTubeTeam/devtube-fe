import Hls from 'hls.js';
import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = true,
  controls = true,
  width = '100%',
  height = 'auto',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [availableLevels, setAvailableLevels] = useState<{ label: string; levelIndex: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = auto

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;

    if (video) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play();

          const levels =
            hls?.levels.map((level, i) => ({
              label: `${level.height}p`,
              levelIndex: i,
            })) || [];

          setAvailableLevels([{ label: 'Auto', levelIndex: -1 }, ...levels]);
        });

        setHlsInstance(hls);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        if (autoPlay) video.play();
      }
    }

    return () => {
      hls?.destroy();
    };
  }, [src, autoPlay]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(e.target.value);
    if (hlsInstance) {
      hlsInstance.currentLevel = level;
      setCurrentLevel(level);
    }
  };

  return (
    <div style={{ position: 'relative', width }}>
      <video
        ref={videoRef}
        controls={controls}
        width="100%"
        height={height}
        style={{ borderRadius: '8px', backgroundColor: '#000' }}
      />
      {availableLevels.length > 1 && (
        <div className="absolute right-2 mt-2 bg-white text-sm rounded shadow px-2 py-1">
          <label htmlFor="quality" className="mr-1 text-gray-800 font-medium">
            Quality:
          </label>
          <select
            id="quality"
            className="border rounded px-1 py-0.5 text-gray-800 bg-white"
            value={currentLevel}
            onChange={handleQualityChange}
          >
            {availableLevels.map(level => (
              <option key={level.levelIndex} value={level.levelIndex}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
