import { IAuthenticatedUser, IGoogleCallbackRequest } from '@/types/auth';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLogin } from '../hooks';
import { storageUtil } from '../utils';
interface IAuthContext {
  user: IAuthenticatedUser | null;
  isAuthenticated: boolean;
  setUser: (user: IAuthenticatedUser | null) => void;
  handleGoogleCallback: (request: any) => void;
  handleLogout: () => void;

  // Loading states
  isLoggingIn: boolean;              // Trạng thái đang đăng nhập qua Google
  isLoggingOut: boolean;             // Trạng thái đang đăng xuất
  isCheckingSession: boolean;        // Trạng thái đang kiểm tra phiên
  isLoadingUser: boolean;            // Trạng thái đang tải thông tin người dùng

  // Error states (tùy chọn)
  authError: Error | null;           // Lỗi xác thực gần nhất nếu có
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    googleCallbackMutation,
    logoutMutation,
    checkSessionMutation,
    getAuthenticatedUserQuery
  } = useLogin();

  const handleGoogleCallback = (request: IGoogleCallbackRequest) => {
    googleCallbackMutation.mutate(request, {
      onSuccess: (response) => {
        const { data } = response;
        const { status, statusCode } = response;

        if (status && statusCode === 200 && data) {
          if (data.user) {
            storageUtil.set('user', data.user, 7);
            setUser(data.user);
          }

          let redirectTo = '/';
          if (data.returnUrl) {
            redirectTo = data.returnUrl;
          } else {
            redirectTo = location.state?.from?.pathname || '/';
          }

          navigate(redirectTo, { replace: true });
          toast.success("Login successfully");
        } else {
          navigate('/auth', { replace: true });
        }
      },
      onError: (error) => {
        console.error('Error during Google callback mutation:', error);
        navigate('/auth', { replace: true });
      }
    });
  };


  // Hàm xử lý logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { status, statusCode } = response;
        if (status && statusCode === 200) {
          setUser(null);

          storageUtil.remove('user');
          navigate('/', { replace: true });
          toast.success("Logged out successfully");
        } else {
          console.error('Unexpected response during logout:', status);
          toast.error("Logout failed. Please try again.");
        }
      },
      onError: () => {
        console.error('Error during logout mutation');
      }
    });
  };

  useEffect(() => {
    const checkSession = () => {
      checkSessionMutation.mutate(undefined, {
        onSuccess: (response) => {
          const { statusCode, statusDetail } = response;

          if (statusCode !== 500) {
            switch (statusDetail) {
              case 'ACCESS_TOKEN_REFRESHED':
              case 'ACCESS_TOKEN_VALID':
                getAuthenticatedUserQuery.refetch().then((result) => {
                  if (result.data?.data) {
                    setUser(result.data.data);
                  }
                });
                break;
              case 'REFRESH_TOKEN_INVALID':
                handleLogout();
                break;
              case 'ID_TOKEN_INVALID':
                handleLogout();
                break;
              default:
                console.error('Unexpected status detail during session check:', statusDetail);
                navigate('/auth', { replace: true });
            }
          }
        },
        onError: (error) => {
          console.error('Error during session check mutation:', error);

        }
      });
    };

    checkSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setUser,
      handleLogout,
      handleGoogleCallback,

      // Loading states
      isLoggingIn: googleCallbackMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      isCheckingSession: checkSessionMutation.isPending,
      isLoadingUser: getAuthenticatedUserQuery.isFetching,

      // Error state
      authError: googleCallbackMutation.error ||
        logoutMutation.error ||
        checkSessionMutation.error ||
        getAuthenticatedUserQuery.error ||
        null
    }),
    [
      user,
      googleCallbackMutation.isPending,
      googleCallbackMutation.error,
      logoutMutation.isPending,
      logoutMutation.error,
      checkSessionMutation.isPending,
      checkSessionMutation.error,
      getAuthenticatedUserQuery.isFetching,
      getAuthenticatedUserQuery.error
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
