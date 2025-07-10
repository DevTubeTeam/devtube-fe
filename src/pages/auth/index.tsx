import { GoogleLoginButton } from '@/components/auth';
import Logo from '@/components/shared/Navbar/Logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import { useAuth } from '../../contexts';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  if (isAuthenticated) return null;

  return (
    <>
      <PageMeta
        title="Đăng nhập - DevTube"
        description="Đăng nhập để tiếp tục sử dụng DevTube."
      />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold">Chào mừng đến với DevTube</h1>
            <p className="text-muted-foreground">Đăng nhập để tiếp tục</p>
          </div>

          {/* Login Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Đăng nhập</CardTitle>
              <CardDescription>
                Chọn phương thức đăng nhập ưu tiên của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <GoogleLoginButton />
              </GoogleOAuthProvider>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-xs text-center text-muted-foreground">
                Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của DevTube
              </div>
            </CardFooter>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Không có tài khoản? Liên hệ quản trị viên</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;