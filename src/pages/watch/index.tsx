import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import HLSVideoPlayer from '@/components/video/HLSVideoPlayer';
import { useAuth } from '@/contexts';
import { useUser } from '@/hooks/useUser';
import { useVideo } from '@/hooks/useVideo';
import { IComment } from '@/types/video';
import { formatViews } from '@/utils/format-video-info.util';
import { ChevronDown, ChevronUp, Clock, ListPlus, MoreHorizontal, Save, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const WatchPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const {
    useGetComments,
    useVideoById,
    useCreateComment,
    useLikeVideo,
    useUnlikeVideo,
    useIsLikedVideo,
    useGetVideoLikesCount,
    useSaveVideo,
    useUnsaveVideo,
    useIsSavedVideo,
    useAddToWatchLater,
    useRemoveFromWatchLater,
    useIsInWatchLater
  } = useVideo();
  const {
    useSubscribeToChannel,
    useUnsubscribeFromChannel,
    useIsSubscribed,
    useGetChannelSubscribersCount
  } = useUser();
  const { user, isAuthenticated } = useAuth();

  // Video and comments hooks
  const createCommentMutation = useCreateComment(videoId || '');
  const { data: video, isLoading: isLoadingVideo } = useVideoById(videoId || '');
  const { data: comments, isLoading: isLoadingComments } = useGetComments(videoId || '');

  // Like video hooks
  const likeVideoMutation = useLikeVideo();
  const unlikeVideoMutation = useUnlikeVideo();
  const { data: isLikedData } = useIsLikedVideo(videoId || '');
  const { data: likesCountData } = useGetVideoLikesCount(videoId || '');

  // Subscribe hooks
  const subscribeMutation = useSubscribeToChannel();
  const unsubscribeMutation = useUnsubscribeFromChannel();
  const { data: isSubscribedData, refetch: refetchIsSubscribed } = useIsSubscribed(video?.userId || '');
  const { data: subscribersCountData, refetch: refetchSubscribersCount } = useGetChannelSubscribersCount(video?.userId || '');

  // Save video hooks
  const saveVideoMutation = useSaveVideo();
  const unsaveVideoMutation = useUnsaveVideo();
  const { data: isSavedData } = useIsSavedVideo(videoId || '');

  // Watch later hooks
  const addToWatchLaterMutation = useAddToWatchLater();
  const removeFromWatchLaterMutation = useRemoveFromWatchLater();
  const { data: isInWatchLaterData } = useIsInWatchLater(videoId || '');

  const [commentContent, setCommentContent] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const isLiked = isLikedData?.isLiked || false;
  const likesCount = likesCountData?.likesCount || 0;
  const isLikeLoading = likeVideoMutation.isPending || unlikeVideoMutation.isPending;

  const isSubscribed = isSubscribedData?.status || false;
  const subscribersCount = subscribersCountData?.data?.totalCount || 0;
  const isSubscribeLoading = subscribeMutation.isPending || unsubscribeMutation.isPending;

  const isSaved = isSavedData?.isSaved || false;
  const isInWatchLater = isInWatchLaterData?.isInWatchLater || false;
  const isSaveLoading = saveVideoMutation.isPending || unsaveVideoMutation.isPending;
  const isWatchLaterLoading = addToWatchLaterMutation.isPending || removeFromWatchLaterMutation.isPending;

  // Debug logs
  console.log('Subscribe Debug:', {
    videoUserId: video?.userId,
    isSubscribedData,
    isSubscribed,
    subscribersCountData,
    subscribersCount,
    isSubscribeLoading
  });

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thích video');
      return;
    }

    if (!videoId) return;

    try {
      if (isLiked) {
        await unlikeVideoMutation.mutateAsync(videoId);
        toast.success('Đã bỏ thích video');
      } else {
        await likeVideoMutation.mutateAsync(videoId);
        toast.success('Đã thích video');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thao tác với video');
    }
  };

  const handleSubscribeToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để đăng ký kênh');
      return;
    }

    if (!video?.userId) return;

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync(video.userId);
        toast.success('Đã hủy đăng ký kênh');
      } else {
        await subscribeMutation.mutateAsync(video.userId);
        toast.success('Đã đăng ký kênh');
      }

      // Force refetch data
      setTimeout(() => {
        refetchIsSubscribed();
        refetchSubscribersCount();
      }, 100);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thao tác với kênh');
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để lưu video');
      return;
    }

    if (!videoId) return;

    try {
      if (isSaved) {
        await unsaveVideoMutation.mutateAsync(videoId);
        toast.success('Đã bỏ lưu video');
      } else {
        await saveVideoMutation.mutateAsync(videoId);
        toast.success('Đã lưu video');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thao tác với video');
    }
  };

  const handleWatchLaterToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào xem sau');
      return;
    }

    if (!videoId) return;

    try {
      if (isInWatchLater) {
        await removeFromWatchLaterMutation.mutateAsync(videoId);
        toast.success('Đã xóa khỏi xem sau');
      } else {
        await addToWatchLaterMutation.mutateAsync(videoId);
        toast.success('Đã thêm vào xem sau');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thao tác với video');
    }
  };

  if (!videoId) {
    return <div>Video not found</div>;
  }

  if (isLoadingVideo) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full aspect-video" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="bg-black rounded-lg overflow-hidden">
        <HLSVideoPlayer
          source={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full aspect-video"
        />
      </div>

      {/* Video Info Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{video.title}</h1>

        {/* Video Stats and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://d1bapesvzv4qyl.cloudfront.net/avatars/${video.userId}.jpg`} />
                <AvatarFallback>{video.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{video.userId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatViews(subscribersCount)} subscribers</p>
              </div>
            </div>
            <Button
              variant={isSubscribed ? "outline" : "secondary"}
              size="sm"
              onClick={handleSubscribeToggle}
              disabled={isSubscribeLoading}
            >
              {isSubscribeLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              className={`gap-2 ${isLiked ? 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 dark:border-gray-100' : ''}`}
              onClick={handleLikeToggle}
              disabled={isLikeLoading}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLikeLoading ? '...' : `${likesCount} Like${likesCount !== 1 ? 's' : ''}`}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleSaveToggle}
                  disabled={isSaveLoading}
                  className="cursor-pointer"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaveLoading ? '...' : isSaved ? 'Bỏ lưu video' : 'Lưu video'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleWatchLaterToggle}
                  disabled={isWatchLaterLoading}
                  className="cursor-pointer"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isWatchLaterLoading ? '...' : isInWatchLater ? 'Xóa khỏi xem sau' : 'Thêm vào xem sau'}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <ListPlus className="h-4 w-4 mr-2" />
                  Thêm vào playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Separator />

      {/* Video Description */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.publishAt)}</span>
              <span>•</span>
              <span>{likesCount} like{likesCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="relative">
              <p className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${!isDescriptionExpanded && video.description.length > 200 ? 'line-clamp-3' : ''
                }`}>
                {video.description}
              </p>
              {video.description.length > 200 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Comments ({comments?.comments?.length || 0})
        </h2>

        {/* Comment Input Box */}
        {isAuthenticated ? (
          <div className="flex gap-3 items-start mb-2">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage src={user?.avatarUrl || `https://d1bapesvzv4qyl.cloudfront.net/avatars/${user?.id}.jpg`} />
              <AvatarFallback>{(user?.displayName || user?.id || '').slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                minLength={1}
                maxLength={500}
                className="mb-2"
                rows={2}
                disabled={createCommentMutation.isPending}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    if (commentContent.trim().length === 0) return;
                    createCommentMutation.mutate({ content: commentContent }, {
                      onSuccess: () => setCommentContent('')
                    });
                  }}
                  disabled={commentContent.trim().length === 0 || createCommentMutation.isPending}
                >
                  {createCommentMutation.isPending ? 'Posting...' : 'Comment'}
                </Button>
              </div>
              {createCommentMutation.isError && (
                <div className="text-red-500 text-sm mt-1">Failed to post comment. Please try again.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <GoogleLoginButton />
          </div>
        )}

        {isLoadingComments ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments?.comments && comments.comments.length > 0 ? (
          <ScrollArea className="h-[400px] rounded-md border border-gray-200 dark:border-gray-800">
            <div className="p-4 space-y-4">
              {comments.comments.map((comment: IComment) => {
                const userInfo = comments.users.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userInfo?.avatar || `https://d1bapesvzv4qyl.cloudfront.net/avatars/${userInfo?.id || comment.userId}.jpg`} />
                      <AvatarFallback>{(userInfo?.name || userInfo?.id || comment.userId).slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{userInfo?.name || userInfo?.id || comment.userId}</p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
