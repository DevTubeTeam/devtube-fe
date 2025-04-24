import { AuthContext } from '@/contexts/AuthContext';
import authService from '@/services/authService';
import { setAccessToken } from '@/services/axios';
import { IGoogleCallBackToken, IGoogleCallBackUser } from '@/types/auth';
import { storageUtil } from '@/utils';
import redirectToGoogleSilentLogin from '@/utils/redirectToGoogleSilentLogin';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';

interface JwtPayload {
  sub: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  exp: number;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: IGoogleCallBackUser | null;
    tokens: IGoogleCallBackToken | null;
  }>({
    user: null,
    tokens: null,
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loadUserFromStorage = useCallback(async () => {
    setIsAuthLoading(true);
    const stored = storageUtil.get<{ tokens: IGoogleCallBackToken; user: IGoogleCallBackUser }>('user_auth');
    if (stored) {
      const { tokens, user } = stored;
      try {
        const decoded = jwtDecode<JwtPayload>(tokens.accessToken);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setAccessToken(tokens.accessToken);
          setAuthState({ user, tokens });
        } else {
          try {
            const response = await authService.refreshToken(tokens.refreshToken);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
            setAccessToken(newAccessToken);
            storageUtil.set('user_auth', {
              user,
              tokens: { ...tokens, accessToken: newAccessToken, refreshToken: newRefreshToken },
            });
            setAuthState({
              user,
              tokens: { ...tokens, accessToken: newAccessToken, refreshToken: newRefreshToken },
            });
          } catch (error) {
            console.warn('Failed to refresh token, clearing auth:', error);
            storageUtil.remove('user_auth');
            setAuthState({ user: null, tokens: null });
          }
        }
      } catch (error) {
        console.error('Failed to decode access token:', error);
        storageUtil.remove('user_auth');
        setAuthState({ user: null, tokens: null });
      }
    } else {
      setAuthState({ user: null, tokens: null });
    }
    setIsAuthLoading(false);
  }, []);

  // const trySilentLogin = useCallback(async () => {
  //   const stored = storageUtil.get<{ tokens: IGoogleCallBackToken }>('user_auth');
  //   if (stored?.tokens.idToken) {
  //     try {
  //       const response = await authService.verifyIdToken(stored.tokens.idToken);
  //       setAuthState(prev => ({
  //         ...prev,
  //         user: response.data.data.user,
  //       }));
  //     } catch (error) {
  //       console.warn('Silent login failed, initiating new silent login:', error);
  //       redirectToGoogleSilentLogin();
  //     }
  //   } else {
  //     // Không có idToken, thực hiện silent login luôn
  //     redirectToGoogleSilentLogin();
  //   }
  // }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user_auth') {
        loadUserFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUserFromStorage]);

  // useEffect(() => {
  //   if (!authState.user && !isAuthLoading) {
  //     console.log('No user found, attempting silent login...');
  //     trySilentLogin();
  //   }
  // }, [authState.user, isAuthLoading, trySilentLogin]);

  const logout = async () => {
    storageUtil.remove('user_auth');
    setAccessToken(null);
    setAuthState({ user: null, tokens: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: !!authState.user,
        isAuthLoading,
        tokens: authState.tokens,
        setUser: user => setAuthState(prev => ({ ...prev, user })),
        setTokens: tokens => setAuthState(prev => ({ ...prev, tokens })),
        logout,
        refreshAuth: loadUserFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
