import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Callback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    if (code) {
      console.log('OAuth code:', code);

      // 🚧 Gửi `code` lên backend sau này tại đây
      // Ví dụ: POST /api/auth/google/callback

      // Demo giả lập: lưu vào localStorage
      localStorage.setItem('oauth_code', code);
      navigate('/dashboard');
    }
  }, []);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default Callback;
