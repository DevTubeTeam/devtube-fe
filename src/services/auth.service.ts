import API_ENDPOINTS from '@/configs/apiEndpoints';
import {
  IAuthenticatedUser,
  IAvatarPresignedUrlRequest,
  IAvatarPresignedUrlResponse,
  IChannel,
  IGetChannelsResponse,
  IGetChannelSubscribersCountResponse,
  IGetSubscribedChannelsResponse,
  IGetUserProfileResponse,
  IGoogleCallbackRequest,
  IGoogleCallbackResponse,
  IGoogleSilentCallbackRequest,
  ISearchChannelsResponse,
  IUpdateUserProfileRequest,
  IUpdateUserProfileResponse,
  IVerifyTokenResponse
} from '@/types/auth';
import api from './axios';

const authService = {
  handleGoogleCallback: async (payload: IGoogleCallbackRequest): Promise<HttpResponse<IGoogleCallbackResponse>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, payload);
      return response.data;
    } catch (error) {
      throw new Error('Failed to handle Google callback');
    }
  },

  handleGoogleSilentCallback: async (payload: IGoogleSilentCallbackRequest): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.SILENT, payload);
      return response.data;
    } catch (error) {
      throw new Error("Failed to handle silent callback");
    };
  },

  handleLogout: async (): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post<HttpResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, {});
      return response.data;
    } catch (error) {
      throw new Error("Failed to logout");
    };
  },

  refreshToken: async (): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {});
      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  verifyIdToken: async (): Promise<HttpResponse<IVerifyTokenResponse>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_ID_TOKEN, {});
      return response.data;
    } catch (error) {
      throw new Error('Failed to verify ID token');
    }
  },

  checkSession: async (): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHECK_SESSION, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to check session');
    }
  },

  getAuthenticatedUser: async (): Promise<HttpResponse<IAuthenticatedUser>> => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get authenticated user');
    }
  },

  getChannels: async (page: number = 1, limit: number = 10, keyword: string = ''): Promise<HttpResponse<IGetChannelsResponse>> => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.GET_CHANNELS, { withCredentials: true, params: { page, limit, keyword } });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get channels');
    }
  },

  // Channel related functions
  getChannelById: async (channelId: string): Promise<HttpResponse<IChannel>> => {
    try {
      const response = await api.get(API_ENDPOINTS.CHANNEL.getById(channelId), { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get channel by id');
    }
  },

  searchChannels: async (keyword: string, page: number = 1, limit: number = 10): Promise<HttpResponse<ISearchChannelsResponse>> => {
    try {
      const response = await api.get(API_ENDPOINTS.CHANNEL.search(keyword, page, limit), { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search channels');
    }
  },

  subscribeToChannel: async (channelId: string): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.CHANNEL.subscribe(channelId), {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to subscribe to channel');
    }
  },

  unsubscribeFromChannel: async (channelId: string): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.CHANNEL.unsubscribe(channelId), {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to unsubscribe from channel');
    }
  },

  isSubscribed: async (channelId: string): Promise<HttpResponse<boolean>> => {
    try {
      const response = await api.get(API_ENDPOINTS.CHANNEL.isSubscribed(channelId), { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to check subscription status');
    }
  },

  getChannelSubscribersCount: async (channelId: string): Promise<HttpResponse<IGetChannelSubscribersCountResponse>> => {
    try {
      const response = await api.get(API_ENDPOINTS.CHANNEL.subscribersCount(channelId), { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get channel subscribers count');
    }
  },

  getSubscribedChannels: async (page: number = 1, limit: number = 10): Promise<HttpResponse<IGetSubscribedChannelsResponse>> => {
    try {
      const response = await api.get(API_ENDPOINTS.CHANNEL.getSubscribedChannels(page, limit), { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get subscribed channels');
    }
  },

  updateUserProfile: async (payload: IUpdateUserProfileRequest): Promise<HttpResponse<IUpdateUserProfileResponse>> => {
    try {
      const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_USER_PROFILE, payload, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  },

  getUserProfile: async (): Promise<HttpResponse<IGetUserProfileResponse>> => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.GET_USER_PROFILE, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user profile');
    }
  },

  createAvatarPresignedUrl: async (payload: IAvatarPresignedUrlRequest): Promise<HttpResponse<IAvatarPresignedUrlResponse>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CREATE_AVATAR_PRESIGNED_URL, payload, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create avatar presigned url');
    }
  },
};

export default authService;
