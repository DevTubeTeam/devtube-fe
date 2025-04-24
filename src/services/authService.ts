import API_ENDPOINTS from '@/configs/apiEndpoints';
import { api } from '@/services/axios';
import {
  IGoogleCallbackRequest,
  IGoogleCallbackResponse,
  IGoogleCallBackUser,
  ILogoutRequest,
  IRefreshTokenResponse,
} from '@/types/auth';

interface HttpResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const authService = {
  handleGoogleCallback: async (payload: IGoogleCallbackRequest) => {
    return await api.get<HttpResponse<IGoogleCallbackResponse>>(`${API_ENDPOINTS.AUTH.CALLBACK}?code=${payload.code}`);
  },

  // handleSilentLogin: async () => {
  //   window.location.href = `${api.defaults.baseURL}/auth/silent`;
  // },

  handleSilentCallback: async (code: string) => {
    return await api.get<HttpResponse<{ idToken: string }>>(`${API_ENDPOINTS.AUTH.SILENT_CALLBACK}?code=${code}`);
  },

  handleLogout: async (payload: ILogoutRequest & { accessToken?: string; refreshToken?: string }) => {
    return await api.post<HttpResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, payload);
  },

  verifyIdToken: async (idToken: string) => {
    return await api.post<HttpResponse<{ user: IGoogleCallBackUser }>>(API_ENDPOINTS.AUTH.VERIFY_ID_TOKEN, { idToken });
  },

  refreshToken: async (refreshToken: string) => {
    return await api.post<HttpResponse<IRefreshTokenResponse>>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

};

export default authService;
