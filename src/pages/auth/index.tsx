import { AuthContext } from '@/contexts/AuthContext';
import useLogin from '@/hooks/useLogin';
import authService from '@/services/authService';
import { IGoogleCallbackRequest } from '@/types/auth';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { googleCallbackMutation } = useLogin();
  const isLoading = googleCallbackMutation.isPending;
  const { setTokens } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: response => {
      const { code } = response;

      console.log('code', code);
      if (!code) {
        console.error('No code received');
        return;
      }

      const IGoogleCallbackRequest: IGoogleCallbackRequest = {
        code: code,
      };

      googleCallbackMutation.mutate(IGoogleCallbackRequest, {
        onSuccess: () => {
          navigate(from, { replace: true });
        },
      });
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  useEffect(() => {
    const handleSilentCallback = async () => {
      const query = new URLSearchParams(location.search);
      const code = query.get('code');
      console.log(location.pathname, code, 'pathname');
      if (code && location.pathname === '/auth/silent/callback') {
        try {
          const response = await authService.handleSilentCallback(code);
          if (response.data) {
            setTokens({ ...response.data, accessToken: '', refreshToken: '' });
            navigate(from, { replace: true });
          }
        } catch (error) {
          console.error('Silent callback failed:', error);
        }
      }
    };

    handleSilentCallback();
  }, [location, navigate, setTokens, from]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to DevHub</h1>
          <p className="text-gray-600 mb-6">Sign in to continue to your account</p>

          <button
            onClick={() => login()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Sign in with Google
          </button>

          {isLoading && <p>Loading...</p>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
