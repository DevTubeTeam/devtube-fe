import { Skeleton } from '@/components/ui/skeleton';
import { IVideoMetadata } from '@/types/video';
import VideoCard from './VideoCard';

interface VideoGridProps {
    isLoading: boolean;
    videos: IVideoMetadata[];
}

const VideoGrid = ({ isLoading, videos }: VideoGridProps) => {

    const skeletonCount = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={index} className="overflow-hidden">
                        <Skeleton className="w-full h-40 rounded-t-lg" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="w-full h-5" />
                            <Skeleton className="w-3/4 h-4" />
                            <div className="flex justify-between items-center">
                                <Skeleton className="w-1/3 h-4" />
                                <Skeleton className="w-1/4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
};

export default VideoGrid;