// src/hooks/useVideo.ts
import videoService from "@/services/video.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDeleteObjectRequest } from "../types/upload";

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

    return {
        useMyVideos,
        useCheckThumbnail,
        useGetVideoStatus,
        useDeleteVideo,
        useVideoById,
        usePublishVideo
    }
}