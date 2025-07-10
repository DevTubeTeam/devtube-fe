// src/hooks/useUser.ts
import authService from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAvatarPresignedUrlRequest, IAvatarPresignedUrlResponse, IUpdateUserProfileRequest, IUpdateUserProfileResponse } from "../types/auth";

/**
 * Custom hook chứa các function để quản lý user và channel
 * @returns Object chứa các hook functions
 */
export function useUser() {
    const queryClient = useQueryClient();

    /**
     * Hook để lấy thông tin channel theo ID
     * @param channelId - ID của channel cần lấy thông tin
     * @returns Query result chứa thông tin channel
     */
    function useGetChannelById(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId],
            queryFn: () => authService.getChannelById(channelId)
        });
    }

    /**
     * Hook để tìm kiếm channels theo từ khóa
     * @param keyword - Từ khóa tìm kiếm
     * @param page - Số trang (mặc định: 1)
     * @param limit - Số lượng kết quả mỗi trang (mặc định: 10)
     * @returns Query result chứa danh sách channels tìm được
     */
    function useSearchChannels(keyword: string, page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['channels', 'search', keyword, page, limit],
            queryFn: () => authService.searchChannels(keyword, page, limit),
            enabled: !!keyword
        });
    }

    /**
     * Hook để đăng ký (subscribe) một channel
     * @returns Mutation để thực hiện đăng ký channel
     */
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

    /**
     * Hook để hủy đăng ký (unsubscribe) một channel
     * @returns Mutation để thực hiện hủy đăng ký channel
     */
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

    /**
     * Hook để kiểm tra xem user đã đăng ký channel chưa
     * @param channelId - ID của channel cần kiểm tra
     * @returns Query result chứa trạng thái đăng ký
     */
    function useIsSubscribed(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId, 'isSubscribed'],
            queryFn: () => authService.isSubscribed(channelId),
            enabled: !!channelId
        });
    }

    /**
     * Hook để lấy số lượng subscribers của một channel
     * @param channelId - ID của channel cần lấy số lượng subscribers
     * @returns Query result chứa số lượng subscribers
     */
    function useGetChannelSubscribersCount(channelId: string) {
        return useQuery({
            queryKey: ['channel', channelId, 'subscribersCount'],
            queryFn: () => authService.getChannelSubscribersCount(channelId),
            enabled: !!channelId
        });
    }

    /**
     * Hook để lấy danh sách channels mà user đã đăng ký
     * @param page - Số trang (mặc định: 1)
     * @param limit - Số lượng kết quả mỗi trang (mặc định: 10)
     * @returns Query result chứa danh sách channels đã đăng ký
     */
    function useGetSubscribedChannels(page: number = 1, limit: number = 10) {
        return useQuery({
            queryKey: ['channels', 'subscribed', page, limit],
            queryFn: () => authService.getSubscribedChannels(page, limit)
        });
    }

    /**
     * Hook để cập nhật thông tin profile của user
     * @returns Mutation để thực hiện cập nhật profile
     */
    function useUpdateUserProfile() {
        return useMutation<HttpResponse<IUpdateUserProfileResponse>, Error, IUpdateUserProfileRequest>({
            mutationFn: (payload) => authService.updateUserProfile(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['me'] });
            }
        });

    }

    /**
     * Hook để lấy thông tin profile của user hiện tại
     * @returns Query result chứa thông tin profile
     */
    function useGetUserProfile() {
        return useQuery({
            queryKey: ['user', 'profile'],
            queryFn: () => authService.getUserProfile()
        });
    }

    /**
     * Hook để tạo presigned URL cho việc upload avatar
     * @returns Mutation để tạo presigned URL
     */
    function useCreateAvatarPresignedUrl() {
        return useMutation<HttpResponse<IAvatarPresignedUrlResponse>, Error, IAvatarPresignedUrlRequest>({
            mutationFn: (payload) => authService.createAvatarPresignedUrl(payload)
        });
    }

    /**
     * Hook để lấy danh sách channels
     * @param page - Số trang (mặc định: 1)
     * @param limit - Số lượng kết quả mỗi trang (mặc định: 10)
     * @param keyword - Từ khóa tìm kiếm
     * @param sortBy - Trường sắp xếp (mặc định: created_at)
     * @param sortOrder - Thứ tự sắp xếp (mặc định: desc)
     */
    function useGetChannels(page: number = 1, limit: number = 10, keyword: string = '') {
        return useQuery({
            queryKey: ['channels', page, limit, keyword],
            queryFn: () => authService.getChannels(page, limit, keyword)
        });
    }
    return {
        useGetChannelById,
        useSearchChannels,
        useSubscribeToChannel,
        useUnsubscribeFromChannel,
        useIsSubscribed,
        useGetChannelSubscribersCount,
        useGetSubscribedChannels,
        useUpdateUserProfile,
        useGetUserProfile,
        useCreateAvatarPresignedUrl,
        useGetChannels
    }
}