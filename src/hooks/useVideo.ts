// src/hooks/useVideo.ts
import videoService from "@/services/video.service";
import { useQuery } from "@tanstack/react-query";

export function useVideo() {

    function useMyVideos() {
        return useQuery({
            queryKey: ['myVideos'],
            queryFn: async () => {
                const response = await videoService.getMyVideos();
                return response.data;
            },
        });
    }

    return {
        useMyVideos
    }
}