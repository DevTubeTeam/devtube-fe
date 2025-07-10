import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideo } from '@/hooks/useVideo';
import { IVideoMetadata } from '@/types/video';
import { formatViews } from '@/utils/format-video-info.util';
import { Link } from 'react-router-dom';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

interface RelatedVideosProps {
    videoId: string;
}

export const RelatedVideos = ({ videoId }: RelatedVideosProps) => {
    const { useGetRelatedVideos } = useVideo();
    const { data: relatedVideosResponse, isLoading: isLoadingRelatedVideos } = useGetRelatedVideos(videoId);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Related Videos</h2>
            {isLoadingRelatedVideos ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex gap-4">
                            <Skeleton className="h-24 w-40 rounded-lg" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : relatedVideosResponse?.videos && relatedVideosResponse.videos.length > 0 ? (
                <ScrollArea className="max-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] pr-1">
                    <div className="space-y-4">
                        {relatedVideosResponse.videos.map((relatedVideo: IVideoMetadata) => (
                            <Link
                                key={relatedVideo.id}
                                to={`/video/${relatedVideo.id}`}
                                className="flex flex-col sm:flex-row gap-2 sm:gap-4 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                            >
                                <div className="relative w-full h-40 sm:w-40 sm:h-24 flex-shrink-0">
                                    <img
                                        src={relatedVideo.thumbnailUrl}
                                        alt={relatedVideo.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                                        {formatViews(relatedVideo.views)} views
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                        {relatedVideo.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                        {relatedVideo.displayName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(relatedVideo.publishAt)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No related videos found
                </div>
            )}
        </div>
    );
};