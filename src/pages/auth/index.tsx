import useGoogleCallback from '@/hooks/useGoogleCallback';
import { GoogleCallbackRequest } from '@/types/auth';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { googleCallbackMutation } = useGoogleCallback();
  const isLoading = googleCallbackMutation.isPending;

  const login = useGoogleLogin({
    flow: 'auth-code', // ✅ Bắt buộc: chuyển sang Authorization Code Flow
    onSuccess: response => {
      const { code } = response;
      if (!code) {
        console.error('No code received');
        return;
      }

      console.log('Authorization Code:', response);

      const googleCallbackRequest: GoogleCallbackRequest = {
        code: code, // đây mới là mã `code` thật
      };

      googleCallbackMutation.mutate(googleCallbackRequest);
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome to DevHub
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in to continue to your account
          </p>

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
