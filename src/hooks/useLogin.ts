import authService from '@/services/authService';
import { IGoogleCallbackRequest, IGoogleCallbackResponse, ILogoutRequest } from '@/types/auth';
import { storageUtil } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';

const useLogin = () => {
  const { logout, refreshAuth } = useAuth();

  const googleCallbackMutation = useMutation({
    mutationKey: ['googleCallback'],
    mutationFn: async (payload: IGoogleCallbackRequest) => {
      const response = await authService.handleGoogleCallback(payload);
      return response.data;
    },
    onSuccess: (response: HttpResponse<IGoogleCallbackResponse>) => {
      const { data } = response;

      if (!data) {
        console.error('No data returned from Google callback mutation');
        return;
      }

      storageUtil.set('user_auth', data);
      refreshAuth();
    },
    onError: () => {
      console.error('Error during Google callback mutation');
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async (payload: ILogoutRequest) => {
      const response = await authService.handleLogout(payload);
      return response.data;
    },
    onSuccess: (response: HttpResponse<null>) => {
      if (response.statusCode === 201) {
        logout();
      }
    },
    onError: () => {
      console.error('Error during logout mutation');
    },
  });

  return {
    googleCallbackMutation,
    logoutMutation,
  };
};

export default useLogin;
