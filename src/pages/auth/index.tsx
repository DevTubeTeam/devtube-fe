import { useGoogleOAuthUrl } from '@/hooks';

const LoginPage = () => {
  const googleUrl = useGoogleOAuthUrl();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => (window.location.href = googleUrl)}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Đăng nhập với Google
      </button>
    </div>
  );
};

export default LoginPage;
