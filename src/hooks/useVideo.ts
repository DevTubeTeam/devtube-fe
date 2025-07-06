// src/hooks/useVideo.ts
import videoService from "@/services/video.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDeleteObjectRequest } from "../types/upload";
import {
    ICreateCommentRequest,
    ICreatePlaylistRequest,
    IEditVideoPlaylistRequest,
    IUpdatePlaylistRequest
} from "../types/video";

/**
 * Custom hook chứa tất cả các hooks liên quan đến video
 * Bao gồm: quản lý video, playlist, comments, likes, saved videos, watch later
 */
export function useVideo() {
    const queryClient = useQueryClient();

    /**
     * Hook để lấy danh sách video của user hiện tại
     * Tự động refetch mỗi 5 giây để cập nhật trạng thái video
     */
    function useMyVideos() {
        return useQuery({
            queryKey: ['myVideos'],
            queryFn: async () => {
                const response = await videoService.getMyVideos();
                return response.data;
            },
            refetchInterval: 5000, // Poll every 5 seconds
        });
    }

    /**
     * Hook để lấy thông tin chi tiết của một video theo ID
     * @param videoId - ID của video cần lấy thông tin
     */
    function useVideoById(videoId: string) {
        return useQuery({
            queryKey: ['video', videoId],
            queryFn: async () => {
                const response = await videoService.getVideobyId(videoId);
                return response.data;
            },
        });
    }

    /**
     * Hook để kiểm tra thumbnail của video
     * @param videoId - ID của video cần kiểm tra thumbnail
     */
    function useCheckThumbnail(videoId: string) {
        return useQuery({
            queryKey: ['thumbnail', videoId],
            queryFn: async () => {
                const response = await videoService.checkThumbnail({ videoId });
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy trạng thái xử lý của video
     * @param videoId - ID của video cần kiểm tra trạng thái
     */
    function useGetVideoStatus(videoId: string) {
        return useQuery({
            queryKey: ['videoStatus', videoId],
            queryFn: async () => {
                const response = await videoService.getVideoStatus(videoId);
                return response.data;
            },
        });
    }

    /**
     * Hook để xóa video
     * @param videoId - ID của video cần xóa
     */
    function useDeleteVideo(videoId: string) {
        return useMutation({
            mutationFn: async () => {
                if (!videoId) throw new Error('Missing video ID');
                const deleteRequest: IDeleteObjectRequest = { id: videoId };
                await videoService.deleteObject(deleteRequest);
                return true;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myVideos'] });
            }
        });
    }

    /**
     * Hook để publish video
     * @param videoId - ID của video cần publish
     */
    function usePublishVideo(videoId: string) {
        return useMutation({
            mutationFn: async () => {
                if (!videoId) throw new Error('Missing video ID');
                const response = await videoService.publishVideo(videoId, { publishAt: new Date().toISOString() });
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myVideos'] });
            }
        });
    }

    /**
     * Hook để lấy danh sách video với các filter khác nhau
     * @param params - Object chứa các tham số filter
     * @param params.type - Loại video: 'recommended' | 'popular' | 'search'
     * @param params.page - Số trang
     * @param params.limit - Số lượng video mỗi trang
     * @param params.category - Danh mục video
     * @param params.timeRange - Khoảng thời gian: 'day' | 'week' | 'month' | 'year' | 'all'
     * @param params.query - Từ khóa tìm kiếm
     * @param params.sortBy - Cách sắp xếp: 'relevance' | 'date' | 'views'
     */
    function useGetVideos(params: {
        type: 'recommended' | 'popular' | 'search';
        page?: number;
        limit?: number;
        category?: string;
        timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
        query?: string;
        sortBy?: 'relevance' | 'date' | 'views';
    }) {
        return useQuery({
            queryKey: ['videos', params],
            queryFn: async () => {
                const response = await videoService.getVideos(params);
                return response.data;
            },
            enabled: !(params.type === 'search' && !params.query) &&
                !(params.type === 'recommended' && !document.cookie.includes('access_token')),
        });
    }

    /**
     * Hook để lấy video cho trang chủ
     * @param page - Số trang (mặc định: 1)
     * @param limit - Số lượng video mỗi trang (mặc định: 10)
     */
    function useGetHomepageVideos(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['homepageVideos', page, limit],
            queryFn: async () => {
                const response = await videoService.getVideoHomePage(page, limit);
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy danh sách comments của video
     * @param videoId - ID của video cần lấy comments
     */
    function useGetComments(videoId: string) {
        return useQuery({
            queryKey: ['comments', videoId],
            queryFn: async () => {
                const response = await videoService.getComments(videoId);
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy danh sách video liên quan
     * @param videoId - ID của video hiện tại
     */
    function useGetRelatedVideos(videoId: string) {
        return useQuery({
            queryKey: ['relatedVideos', videoId],
            queryFn: async () => {
                const response = await videoService.getRelatedVideos(videoId);
                return response.data;
            },
        });
    }

    /**
     * Hook để tạo comment mới cho video
     * @param videoId - ID của video cần comment
     */
    function useCreateComment(videoId: string) {
        return useMutation({
            mutationFn: async (data: ICreateCommentRequest) => {
                const response = await videoService.createComment(videoId, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
            }
        });
    }

    // Playlist hooks
    /**
     * Hook để lấy danh sách playlist
     * @param page - Số trang (mặc định: 1)
     * @param limit - Số lượng playlist mỗi trang (mặc định: 10)
     */
    function useGetPlaylists(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['playlists', page, limit],
            queryFn: async () => {
                const response = await videoService.getPlaylists(page, limit);
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy thông tin chi tiết của playlist
     * @param playlistId - ID của playlist cần lấy thông tin
     */
    function useGetPlaylistById(playlistId: string) {
        return useQuery({
            queryKey: ['playlist', playlistId],
            queryFn: async () => {
                const response = await videoService.getPlaylistById(playlistId);
                return response.data;
            },
        });
    }

    /**
     * Hook để tạo playlist mới
     */
    function useCreatePlaylist() {
        return useMutation({
            mutationFn: async (data: ICreatePlaylistRequest) => {
                const response = await videoService.createPlaylist(data);
                return response.data;
            },
            onSuccess: () => {
                // Invalidate all queries that start with 'playlists' (ignore page, limit)
                queryClient.invalidateQueries({ queryKey: ['playlists'], exact: false });
            }
        });
    }

    /**
     * Hook để cập nhật thông tin playlist
     */
    function useUpdatePlaylist() {
        return useMutation({
            mutationFn: async ({ playlistId, data }: { playlistId: string; data: IUpdatePlaylistRequest }) => {
                const response = await videoService.updatePlaylist(playlistId, data);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['playlists'], exact: false });
            }
        });
    }


    /**
     * Hook để xóa playlist
     */
    function useDeletePlaylist() {
        return useMutation({
            mutationFn: async (playlistId: string) => {
                const response = await videoService.deletePlaylist(playlistId);
                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['playlists'], exact: false });
            }
        });
    }

    /**
     * Hook để chỉnh sửa video trong playlist (thêm/xóa video)
     */
    function useEditVideoPlaylist() {
        return useMutation({
            mutationFn: async ({ playlistId, data }: { playlistId: string; data: IEditVideoPlaylistRequest }) => {
                const response = await videoService.editVideoPlaylist(playlistId, data);
                return response.data;
            },
            onSuccess: (_, { playlistId }) => {
                queryClient.invalidateQueries({ queryKey: ['playlists'], exact: false });
            }
        });
    }

    /**
     * Hook để lấy danh sách video của một channel
     * @param channelId - ID của channel cần lấy danh sách video
     */
    function useGetChannelVideos(channelId: string) {
        return useQuery({
            queryKey: ['channelVideos', channelId],
            queryFn: async () => {
                const response = await videoService.getChannelVideos(channelId);
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy danh sách playlist của một channel
     * @param channelId - ID của channel cần lấy danh sách playlist
     */
    function useGetChannelPlaylists(channelId: string) {
        return useQuery({
            queryKey: ['channelPlaylists', channelId],
            queryFn: async () => {
                const response = await videoService.getChannelPlaylists(channelId);
                return response.data;
            },
        });
    }

    // Like video hooks
    /**
     * Hook để like một video
     */
    function useLikeVideo() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.likeVideo(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['videoLikesCount', videoId] });
                queryClient.invalidateQueries({ queryKey: ['isLikedVideo', videoId] });
                queryClient.invalidateQueries({ queryKey: ['likedVideos'] });
            }
        });
    }

    /**
     * Hook để unlike một video
     */
    function useUnlikeVideo() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.unlikeVideo(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['videoLikesCount', videoId] });
                queryClient.invalidateQueries({ queryKey: ['isLikedVideo', videoId] });
                queryClient.invalidateQueries({ queryKey: ['likedVideos'] });
            }
        });
    }

    /**
     * Hook để lấy số lượng like của một video
     * @param videoId - ID của video cần lấy số lượng like
     */
    function useGetVideoLikesCount(videoId: string) {
        return useQuery({
            queryKey: ['videoLikesCount', videoId],
            queryFn: async () => {
                const response = await videoService.getVideoLikesCount(videoId);
                return response.data;
            },
        });
    }

    /**
     * Hook để lấy danh sách video đã like của user hiện tại
     */
    function useGetLikedVideos() {
        return useQuery({
            queryKey: ['likedVideos'],
            queryFn: async () => {
                const response = await videoService.getLikedVideos();
                return response.data;
            },
        });
    }

    /**
     * Hook để kiểm tra xem user hiện tại đã like video chưa
     * @param videoId - ID của video cần kiểm tra
     */
    function useIsLikedVideo(videoId: string) {
        return useQuery({
            queryKey: ['isLikedVideo', videoId],
            queryFn: async () => {
                const response = await videoService.isLikedVideo(videoId);
                return response.data;
            },
        });
    }

    // Saved video hooks
    /**
     * Hook để lưu video vào danh sách đã lưu
     */
    function useSaveVideo() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.saveVideo(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['isSavedVideo', videoId] });
                queryClient.invalidateQueries({ queryKey: ['savedVideos'] });
            }
        });
    }

    /**
     * Hook để bỏ lưu video khỏi danh sách đã lưu
     */
    function useUnsaveVideo() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.unsaveVideo(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['isSavedVideo', videoId] });
                queryClient.invalidateQueries({ queryKey: ['savedVideos'] });
            }
        });
    }

    /**
     * Hook để lấy danh sách video đã lưu của user hiện tại
     */
    function useGetSavedVideos() {
        return useQuery({
            queryKey: ['savedVideos'],
            queryFn: async () => {
                const response = await videoService.getSavedVideos();
                return response.data;
            },
        });
    }

    /**
     * Hook để kiểm tra xem video đã được lưu chưa
     * @param videoId - ID của video cần kiểm tra
     */
    function useIsSavedVideo(videoId: string) {
        return useQuery({
            queryKey: ['isSavedVideo', videoId],
            queryFn: async () => {
                const response = await videoService.isSavedVideo(videoId);
                return response.data;
            },
        });
    }

    // Watch later hooks
    /**
     * Hook để thêm video vào danh sách xem sau
     */
    function useAddToWatchLater() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.addToWatchLater(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['isInWatchLater', videoId] });
                queryClient.invalidateQueries({ queryKey: ['watchLaterVideos'] });
            }
        });
    }

    /**
     * Hook để xóa video khỏi danh sách xem sau
     */
    function useRemoveFromWatchLater() {
        return useMutation({
            mutationFn: async (videoId: string) => {
                const response = await videoService.removeFromWatchLater(videoId);
                return response.data;
            },
            onSuccess: (_, videoId) => {
                queryClient.invalidateQueries({ queryKey: ['isInWatchLater', videoId] });
                queryClient.invalidateQueries({ queryKey: ['watchLaterVideos'] });
            }
        });
    }

    /**
     * Hook để lấy danh sách video trong danh sách xem sau
     */
    function useGetWatchLaterVideos() {
        return useQuery({
            queryKey: ['watchLaterVideos'],
            queryFn: async () => {
                const response = await videoService.getWatchLaterVideos();
                return response.data;
            },
        });
    }

    /**
     * Hook để kiểm tra xem video đã được thêm vào danh sách xem sau chưa
     * @param videoId - ID của video cần kiểm tra
     */
    function useIsInWatchLater(videoId: string) {
        return useQuery({
            queryKey: ['isInWatchLater', videoId],
            queryFn: async () => {
                const response = await videoService.isInWatchLater(videoId);
                return response.data;
            },
        });
    }

    return {
        useMyVideos,
        useCheckThumbnail,
        useGetVideoStatus,
        useDeleteVideo,
        useVideoById,
        usePublishVideo,
        useGetVideos,
        useGetHomepageVideos,
        useGetComments,
        useGetRelatedVideos,
        useCreateComment,
        // Playlist hooks
        useGetPlaylists,
        useGetPlaylistById,
        useCreatePlaylist,
        useUpdatePlaylist,
        useDeletePlaylist,
        useEditVideoPlaylist,
        useGetChannelVideos,
        useGetChannelPlaylists,
        // Like video hooks
        useLikeVideo,
        useUnlikeVideo,
        useGetVideoLikesCount,
        useGetLikedVideos,
        useIsLikedVideo,
        // Saved video hooks
        useSaveVideo,
        useUnsaveVideo,
        useGetSavedVideos,
        useIsSavedVideo,
        // Watch later hooks
        useAddToWatchLater,
        useRemoveFromWatchLater,
        useGetWatchLaterVideos,
        useIsInWatchLater,
    }
}