import api from '@/services/axios';
import { GoogleCallbackRequest, GoogleCallbackResponse } from '@/types/auth';
import API_ENDPOINTS from '../configs/apiEndpoints';

const authService = {
  handleGoogleCallback: async (payload: GoogleCallbackRequest) => {
    return await api.get<HttpResponse<GoogleCallbackResponse>>(
      `${API_ENDPOINTS.AUTH.CALLBACK}?code=${payload.code}`,
    );
  },
};

export default authService;
