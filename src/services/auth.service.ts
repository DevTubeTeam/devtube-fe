import API_ENDPOINTS from '@/configs/apiEndpoints';
import {
  IGoogleCallbackRequest,
  IGoogleCallbackResponse,
  IGoogleCallBackUser,
  IGoogleSilentCallbackRequest,
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

  getAuthenticatedUser: async (): Promise<HttpResponse<IGoogleCallBackUser>> => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get authenticated user');
    }
  }


};

export default authService;
