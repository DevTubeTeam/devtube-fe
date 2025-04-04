import API_ENDPOINTS from '@/configs/apiEndpoints';
import api from '@/services/axios';
import { GoogleLoginRequest, GoogleLoginResponse } from '@/types/auth';

const authService = {
  checkRoomAvailability: async (payload: GoogleLoginRequest) => {
    return await api.post<HttpResponse<GoogleLoginResponse>>(
      `${API_ENDPOINTS.AUTH.LOGIN}`,
      payload,
    );
  },
};

export default reservationService;
