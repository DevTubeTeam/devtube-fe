import authService from '@/services/authService';
import { GoogleCallbackRequest, GoogleCallbackResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

const useGoogleCallback = () => {
  const googleCallbackMutation = useMutation({
    mutationKey: ['googleCallback'],
    mutationFn: async (payload: GoogleCallbackRequest) => {
      const response = await authService.handleGoogleCallback(payload);
      return response.data;
    },
    onSuccess: (response: HttpResponse<GoogleCallbackResponse>) => {
      console.log(response);
      // const { accessToken, refreshToken } = response.payload;
      // localStorage.setItem('accessToken', accessToken);
      // if (refreshToken) {
      //   localStorage.setItem('refreshToken', refreshToken);
      // }
    },
    onError: () => {
      console.error('Error during Google callback mutation');
    },
  });

  return {
    googleCallbackMutation,
  };
};

export default useGoogleCallback;
