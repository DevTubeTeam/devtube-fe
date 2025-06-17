import { Skeleton } from '@/components/ui/skeleton';
import { IVideoMetadata } from '@/types/video';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

interface VideoGridProps {
    isLoading: boolean;
    videos: IVideoMetadata[];
}

const VideoGrid = ({ isLoading, videos }: VideoGridProps) => {
    const skeletonCount = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="overflow-hidden rounded-xl bg-card"
                    >
                        <Skeleton className="w-full aspect-video rounded-t-xl" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="w-3/4 h-6" />
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="w-1/2 h-4" />
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="w-1/4 h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
                <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <VideoCard video={video} />
                </motion.div>
            ))}
        </div>
    );
};

export default VideoGrid;