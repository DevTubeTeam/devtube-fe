import { useGoogleLogin } from '@/hooks';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const LoginPage = () => {
  const { mutate: loginWithGoogle, status } = useGoogleLogin();
  const isLoading = status === 'pending';

  const handleLoginSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    loginWithGoogle(token, {
      onSuccess: data => {
        console.log('Login successful:', data);
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = '/dashboard';
      },
      onError: error => {
        console.error('Error during login:', error);
      },
    });
  };

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
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.error('Login Failed');
            }}
          />
          {isLoading && <p>Loading...</p>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
