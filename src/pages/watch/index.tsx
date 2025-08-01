import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import PageMeta from '@/components/common/PageMeta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { formatDate, formatViews } from '@/utils/format-video-info.util';
import { ChevronDown, ChevronUp, Clock, Copy, ListPlus, MoreHorizontal, Save, Share2, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const WatchPage = () => {


  const { videoId } = useParams<{ videoId: string }>();
  console.log('VideoId', videoId);
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
    useIsInWatchLater,
    useGetPlaylists,
    useEditVideoPlaylist,
  } = useVideo();
  const {
    useSubscribeToChannel,
    useUnsubscribeFromChannel,
    useIsSubscribed,
    useGetChannelSubscribersCount
  } = useUser();
  const { isAuthenticated } = useAuth();

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

  // Playlist hooks
  const { data: playlistsData, isLoading: isLoadingPlaylists } = useGetPlaylists();
  const editVideoPlaylistMutation = useEditVideoPlaylist();

  const [commentContent, setCommentContent] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

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
    } catch (_error) {
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
    } catch (_error) {
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
    } catch (_error) {
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
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi thao tác với video');
    }
  };

  const handleShareVideo = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyLink = async () => {
    const videoUrl = `${window.location.origin}/watch/${videoId}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      toast.success('Đã sao chép link video!');
      setIsShareModalOpen(false);
    } catch (err) {
      toast.error('Không thể sao chép link');
    }
  };

  const handleShareToSocial = (platform: string) => {
    const videoUrl = `${window.location.origin}/watch/${videoId}`;
    const text = video?.title || 'Check out this video!';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsShareModalOpen(false);
  };

  const handleOpenPlaylistDialog = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm video vào playlist');
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!videoId || !video) return;

    try {
      await editVideoPlaylistMutation.mutateAsync({
        playlistId,
        data: {
          videos: [video]
        }
      });
      toast.success('Đã thêm video vào playlist!');
      setIsPlaylistModalOpen(false);
    } catch (error) {
      toast.error('Không thể thêm video vào playlist');
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

  // Handle special statusDetail cases
  if (video.statusDetail === 'VIDEO_NOT_READY') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-2xl font-semibold mb-2">Video đang được xử lý</div>
        <div className="text-gray-500 dark:text-gray-400">Video của bạn đang được xử lý, vui lòng quay lại sau.</div>
      </div>
    );
  }
  if (video.statusDetail === 'VIDEO_MISSING_URL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-2xl font-semibold mb-2">Không tìm thấy đường dẫn video</div>
        <div className="text-gray-500 dark:text-gray-400">Video hiện không có đường dẫn phát, vui lòng thử lại sau.</div>
      </div>
    );
  }
  if (video.statusDetail === 'VIDEO_NOT_READY_OR_MISSING_URL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-2xl font-semibold mb-2">Video chưa sẵn sàng hoặc thiếu đường dẫn</div>
        <div className="text-gray-500 dark:text-gray-400">Video chưa sẵn sàng hoặc thiếu đường dẫn phát, vui lòng quay lại sau.</div>
      </div>
    );
  }
  if (video.statusDetail === 'VIDEO_NOT_PUBLISHED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-2xl font-semibold mb-2">Video chưa được xuất bản</div>
        <div className="text-gray-500 dark:text-gray-400">Video chưa được xuất bản, vui lòng quay lại sau.</div>
      </div>
    );
  }

  // Helper for fallback text
  const renderOrFallback = (value: any, fallback: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="italic text-gray-400">{fallback}</span>;
    }
    return value;
  };

  return (
    <>
      <PageMeta
        title={video ? `${renderOrFallback(video.title, 'Không có tiêu đề')} - DevTube` : "Video - DevTube"}
        description={video ? `${video.description?.substring(0, 160) || 'Không có mô tả'}...` : "Watch amazing videos on DevTube"}
      />
      <div className="space-y-6 px-2 sm:px-0">
        {/* Video Player Section */}
        <div className="bg-black rounded-lg overflow-hidden">
          {video.videoUrl
            ? (
              <HLSVideoPlayer
                source={video.videoUrl}
                poster={video.thumbnailUrl}
                className="w-full aspect-video"
              />
            )
            : (
              <div className="flex items-center justify-center aspect-video text-gray-400 text-lg">
                Không có đường dẫn video để phát
              </div>
            )
          }
        </div>

        {/* Video Info Section */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 break-words leading-tight mb-2">
            {renderOrFallback(video.title, 'Không có tiêu đề')}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Channel Info + Subscribe */}
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={video.avatarUrl || undefined} />
                  <AvatarFallback>
                    {renderOrFallback(
                      (video.displayName || video.userId || '').slice(0, 2).toUpperCase(),
                      'NA'
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {renderOrFallback(video.displayName, 'Không có tên kênh')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {typeof subscribersCount === 'number'
                      ? `${formatViews(subscribersCount)} subscribers`
                      : <span className="italic text-gray-400">Không có dữ liệu người đăng ký</span>
                    }
                  </p>
                </div>
              </div>
              <Button
                variant={isSubscribed ? "outline" : "secondary"}
                size="sm"
                onClick={handleSubscribeToggle}
                disabled={isSubscribeLoading}
                className="w-full xs:w-auto"
              >
                {isSubscribeLoading ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>
            {/* Actions */}
            <div className="flex flex-nowrap overflow-x-auto gap-2 py-1 w-full sm:w-auto">
              <div className="text-sm text-gray-500 dark:text-gray-400 mr-2 min-w-max">
                {typeof video.views === 'number'
                  ? `${formatViews(video.views)} views`
                  : <span className="italic text-gray-400">Không có dữ liệu lượt xem</span>
                }
              </div>
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                className={`gap-2 min-w-max ${isLiked ? 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 dark:border-gray-100' : ''}`}
                onClick={handleLikeToggle}
                disabled={isLikeLoading}
              >
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLikeLoading
                  ? '...'
                  : `${typeof likesCount === 'number' ? likesCount : 0} Like${likesCount !== 1 ? 's' : ''}`
                }
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-max">
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
                  <DropdownMenuItem
                    onClick={handleOpenPlaylistDialog}
                    className="cursor-pointer"
                  >
                    <ListPlus className="h-4 w-4 mr-2" />
                    Thêm vào playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleShareVideo}
                    className="cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Separator />

        {/* Video Description */}
        <Card>
          <CardContent className="pt-4 pb-2 px-2 sm:px-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {video.publishAt
                    ? formatDate(video.publishAt)
                    : <span className="italic text-gray-400">Không có ngày đăng</span>
                  }
                </span>
                <span>•</span>
                <span>
                  {typeof likesCount === 'number'
                    ? `${likesCount} like${likesCount !== 1 ? 's' : ''}`
                    : <span className="italic text-gray-400">Không có dữ liệu lượt thích</span>
                  }
                </span>
              </div>
              <div className="relative">
                <p className={`text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${!isDescriptionExpanded && video.description?.length > 120 ? 'line-clamp-2 sm:line-clamp-3' : ''}`}>
                  {renderOrFallback(video.description, 'Không có mô tả')}
                </p>
                {video.description && video.description.length > 120 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
            {typeof comments?.comments?.length === 'number'
              ? `Comments (${comments.comments.length})`
              : 'Comments (Không có dữ liệu)'
            }
          </h2>

          {/* Comment Input Box */}
          {isAuthenticated ? (
            <div className="flex flex-col xs:flex-row gap-2 items-start mb-2">
              <div className="flex-1 w-full">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  minLength={1}
                  maxLength={500}
                  className="mb-2 w-full"
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
                  const userInfo = comments.users?.find(u => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={
                          userInfo?.avatar
                            ? userInfo.avatar
                            : `https://d1bapesvzv4qyl.cloudfront.net/avatars/${userInfo?.id || comment.userId}.jpg`
                        } />
                        <AvatarFallback>
                          {renderOrFallback(
                            (userInfo?.name || userInfo?.id || comment.userId || '').slice(0, 2).toUpperCase(),
                            'NA'
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {renderOrFallback(userInfo?.name || userInfo?.id || comment.userId, 'Ẩn danh')}
                          </p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.createdAt
                              ? formatDate(comment.createdAt)
                              : <span className="italic text-gray-400">Không có ngày</span>
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {renderOrFallback(comment.content, 'Không có nội dung')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {comments && comments.comments && comments.comments.length === 0
                ? 'No comments yet. Be the first to comment!'
                : 'Không có dữ liệu bình luận'
              }
            </div>
          )}
        </div>

        {/* Share Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="w-full max-w-full sm:max-w-sm p-2 sm:p-6">
            <DialogHeader>
              <DialogTitle>Chia sẻ video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Copy Link */}
              <div className="flex flex-col gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-muted/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Link video</p>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-sm text-gray-900 dark:text-gray-100 break-all select-all flex-1 min-w-0">
                    {videoId
                      ? `${window.location.origin}/watch/${videoId}`
                      : <span className="italic text-gray-400">Không có link video</span>
                    }
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex-shrink-0 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Sao chép
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Playlist Selection Modal */}
        <Dialog open={isPlaylistModalOpen} onOpenChange={setIsPlaylistModalOpen}>
          <DialogContent className="w-full max-w-full sm:max-w-sm p-2 sm:p-6">
            <DialogHeader>
              <DialogTitle>Chọn playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isLoadingPlaylists ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : playlistsData?.playlists && playlistsData.playlists.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {playlistsData.playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      disabled={editVideoPlaylistMutation.isPending}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <img
                        src={playlist.thumbnailUrl || "https://cdn-icons-png.flaticon.com/512/1179/1179069.png"}
                        alt={playlist.title || 'Không có tiêu đề'}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {renderOrFallback(playlist.title, 'Không có tiêu đề')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {typeof playlist.videos?.length === 'number'
                            ? `${playlist.videos.length} video${playlist.videos.length !== 1 ? 's' : ''}`
                            : 'Không có dữ liệu video'
                          }
                        </p>
                      </div>
                      {editVideoPlaylistMutation.isPending && (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {playlistsData && playlistsData.playlists && playlistsData.playlists.length === 0
                    ? (
                      <>
                        <p>Bạn chưa có playlist nào.</p>
                        <p className="text-sm mt-1">Tạo playlist mới để thêm video.</p>
                      </>
                    )
                    : <p>Không có dữ liệu playlist</p>
                  }
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default WatchPage;
