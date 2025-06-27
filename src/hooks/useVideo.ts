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

export function useVideo() {
    const queryClient = useQueryClient();

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

    function useVideoById(videoId: string) {
        return useQuery({
            queryKey: ['video', videoId],
            queryFn: async () => {
                const response = await videoService.getVideobyId(videoId);
                return response.data;
            },
        });
    }

    function useCheckThumbnail(videoId: string) {
        return useQuery({
            queryKey: ['thumbnail', videoId],
            queryFn: async () => {
                const response = await videoService.checkThumbnail({ videoId });
                return response.data;
            },
        });
    }

    function useGetVideoStatus(videoId: string) {
        return useQuery({
            queryKey: ['videoStatus', videoId],
            queryFn: async () => {
                const response = await videoService.getVideoStatus(videoId);
                return response.data;
            },
        });
    }

    function useDeleteVideo(videoId: string) {
        return useMutation({
            mutationFn: async () => {
                if (!videoId) throw new Error('Missing video ID');
                const deleteRequest: IDeleteObjectRequest = { videoId };
                await videoService.deleteObject(deleteRequest);
                return true;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myVideos'] });
            }
        });
    }

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

    function useGetHomepageVideos(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['homepageVideos', page, limit],
            queryFn: async () => {
                const response = await videoService.getVideoHomePage(page, limit);
                return response.data;
            },
        });
    }


    function useGetComments(videoId: string) {
        return useQuery({
            queryKey: ['comments', videoId],
            queryFn: async () => {
                const response = await videoService.getComments(videoId);
                return response.data;
            },
        });
    }

    function useGetRelatedVideos(videoId: string) {
        return useQuery({
            queryKey: ['relatedVideos', videoId],
            queryFn: async () => {
                const response = await videoService.getRelatedVideos(videoId);
                return response.data;
            },
        });
    }

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
    function useGetPlaylists(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['playlists', page, limit],
            queryFn: async () => {
                const response = await videoService.getPlaylists(page, limit);
                return response.data;
            },
        });
    }

    function useGetPlaylistById(playlistId: string) {
        return useQuery({
            queryKey: ['playlist', playlistId],
            queryFn: async () => {
                const response = await videoService.getPlaylistById(playlistId);
                return response.data;
            },
        });
    }

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

    function useGetChannelVideos(channelId: string) {
        return useQuery({
            queryKey: ['channelVideos', channelId],
            queryFn: async () => {
                const response = await videoService.getChannelVideos(channelId);
                return response.data;
            },
        });
    }

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

    function useGetVideoLikesCount(videoId: string) {
        return useQuery({
            queryKey: ['videoLikesCount', videoId],
            queryFn: async () => {
                const response = await videoService.getVideoLikesCount(videoId);
                return response.data;
            },
        });
    }

    function useGetLikedVideos() {
        return useQuery({
            queryKey: ['likedVideos'],
            queryFn: async () => {
                const response = await videoService.getLikedVideos();
                return response.data;
            },
        });
    }

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

    function useGetSavedVideos() {
        return useQuery({
            queryKey: ['savedVideos'],
            queryFn: async () => {
                const response = await videoService.getSavedVideos();
                return response.data;
            },
        });
    }

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

    function useGetWatchLaterVideos() {
        return useQuery({
            queryKey: ['watchLaterVideos'],
            queryFn: async () => {
                const response = await videoService.getWatchLaterVideos();
                return response.data;
            },
        });
    }

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