import API_ENDPOINTS from '@/configs/apiEndpoints';
import { api } from '@/services/axios';
import {
  IGoogleCallbackRequest,
  IGoogleCallbackResponse,
  IGoogleCallBackUser,
  ILogoutRequest,
  IRefreshTokenResponse,
} from '@/types/auth';

const authService = {
  handleGoogleCallback: async (payload: IGoogleCallbackRequest): Promise<HttpResponse<IGoogleCallbackResponse | null>> => {
    try {
      const response = await api.get(`${API_ENDPOINTS.AUTH.CALLBACK}?code=${payload.code}`);
      return response.data;
    } catch (error) {
      return { statusCode: 500, message: "Failed to fetch products", data: null };
    }
  },

  handleSilentCallback: async (code: string): Promise<HttpResponse<{ idToken: string } | null>> => {
    try {
      const response = await api.get<HttpResponse<{ idToken: string }>>(`${API_ENDPOINTS.AUTH.SILENT_CALLBACK}?code=${code}`);
      return response.data;
    } catch (error) {
      return { statusCode: 500, message: "Failed to fetch products", data: null };
    };
  },

  handleLogout: async (payload: ILogoutRequest & { accessToken?: string; refreshToken?: string }): Promise<HttpResponse<null>> => {
    try {
      const response = await api.post<HttpResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, payload);
      return response.data;
    } catch (error) {
      return { statusCode: 500, message: "Failed to fetch products", data: null };
    };
  },

  verifyIdToken: async (idToken: string): Promise<HttpResponse<{ user: IGoogleCallBackUser } | null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_ID_TOKEN, { idToken });
      return response.data;
    } catch (error) {
      return { statusCode: 500, message: "Failed to fetch products", data: null };
    };
  },

  refreshToken: async (refreshToken: string): Promise<HttpResponse<IRefreshTokenResponse | null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
      return response.data;
    } catch (error) {
      return { statusCode: 500, message: "Failed to fetch products", data: null };
    };
  },
};

export default authService;
