// src/hooks/useVideo.ts
import authService from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
    const queryClient = useQueryClient();

    // Lấy thông tin channel theo id
    function useGetChannelById(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId],
            queryFn: () => authService.getChannelById(channelId)
        });
    }

    // Tìm kiếm channel
    function useSearchChannels(keyword: string, page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['channels', 'search', keyword, page, limit],
            queryFn: () => authService.searchChannels(keyword, page, limit),
            enabled: !!keyword
        });
    }

    // Đăng ký channel
    function useSubscribeToChannel() {
        return useMutation<HttpResponse<null>, Error, string>({
            mutationFn: (channelId) => authService.subscribeToChannel(channelId),
            onSuccess: (_, channelId) => {
                queryClient.invalidateQueries({ queryKey: ['channel'] });
                queryClient.invalidateQueries({ queryKey: ['channels', 'subscribed'] });
                queryClient.invalidateQueries({ queryKey: ['channel', channelId, 'isSubscribed'] });
                queryClient.invalidateQueries({ queryKey: ['channel', channelId, 'subscribersCount'] });
            }
        });
    }

    // Hủy đăng ký channel
    function useUnsubscribeFromChannel() {
        return useMutation<HttpResponse<null>, Error, string>({
            mutationFn: (channelId) => authService.unsubscribeFromChannel(channelId),
            onSuccess: (_, channelId) => {
                queryClient.invalidateQueries({ queryKey: ['channel'] });
                queryClient.invalidateQueries({ queryKey: ['channels', 'subscribed'] });
                queryClient.invalidateQueries({ queryKey: ['channel', channelId, 'isSubscribed'] });
                queryClient.invalidateQueries({ queryKey: ['channel', channelId, 'subscribersCount'] });
            }
        });
    }

    // Kiểm tra đã đăng ký channel chưa
    function useIsSubscribed(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId, 'isSubscribed'],
            queryFn: () => authService.isSubscribed(channelId),
            enabled: !!channelId
        });
    }

    // Lấy số lượng subscribers của channel
    function useGetChannelSubscribersCount(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId, 'subscribersCount'],
            queryFn: () => authService.getChannelSubscribersCount(channelId),
            enabled: !!channelId
        });
    }

    // Lấy danh sách channel đã đăng ký
    function useGetSubscribedChannels(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['channels', 'subscribed', page, limit],
            queryFn: () => authService.getSubscribedChannels(page, limit)
        });
    }

    return {
        useGetChannelById,
        useSearchChannels,
        useSubscribeToChannel,
        useUnsubscribeFromChannel,
        useIsSubscribed,
        useGetChannelSubscribersCount,
        useGetSubscribedChannels
    }
}