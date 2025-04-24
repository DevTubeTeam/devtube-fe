import { IGoogleCallBackToken, IGoogleCallBackUser } from '@/types/auth';
import { createContext } from 'react';

interface IAuthContext {
  user: IGoogleCallBackUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  tokens: IGoogleCallBackToken | null;
  setUser: (user: IGoogleCallBackUser | null) => void;
  setTokens: (token: IGoogleCallBackToken | null) => void;
  logout: () => void;
  refreshAuth: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  tokens: null,
  setUser: () => {},
  setTokens: () => {},
  logout: () => {},
  refreshAuth: () => {},
});
