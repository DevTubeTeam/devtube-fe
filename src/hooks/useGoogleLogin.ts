import { GoogleLoginRequest, GoogleLoginResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

const useGoogleLogin = () => {
  const loginMutation = useMutation({
    mutationKey: ['userLogin'],
    mutationFn: async (payload: GoogleLoginRequest) => {
      const response = await authService.login(payload);
      return response.data;
    },
    onSuccess: (response: HttpResponse<GoogleLoginResponse>) => {},
    onError: () => {},
  });

  return {
    loginMutation,
  };
};

export default useGoogleLogin;
