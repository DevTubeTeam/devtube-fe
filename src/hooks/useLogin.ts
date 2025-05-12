import STATUS_CODE from '@/constants/statusCode';
import authService from '@/services/authService';
import { IGoogleCallbackRequest, IGoogleCallbackResponse, ILogoutRequest } from '@/types/auth';
import { storageUtil } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';

const useLogin = () => {
  const { logout, refreshAuth } = useAuth();

  const googleCallbackMutation = useMutation<HttpResponse<IGoogleCallbackResponse | null>, Error, IGoogleCallbackRequest>({
    mutationKey: ['googleCallback'],
    mutationFn: authService.handleGoogleCallback,
    onSuccess: (response) => {
      const { data } = response;

      if (!data) {
        console.error('No data returned from Google callback mutation');
        return;
      }

      storageUtil.set('user_auth', data);
      refreshAuth();
    },
    onError: (error) => {
      console.error('Error during Google callback mutation:', error);
    },
  });


  const logoutMutation = useMutation<HttpResponse<null>, Error, ILogoutRequest>({
    mutationKey: ['logout'],
    mutationFn: authService.handleLogout,
    onSuccess: (response) => {
      const { statusCode } = response;

      if (statusCode === STATUS_CODE.CREATED) {
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
