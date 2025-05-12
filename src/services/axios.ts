import { storageUtil } from '@/utils';
import axios, { AxiosInstance } from 'axios';

let accessToken: string | null = null;

const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  if (accessToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const stored = storageUtil.get<{ tokens: { accessToken: string; refreshToken: string; idToken: string } }>(
          'user_auth',
        );
        if (!stored?.tokens.refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await api.post('/auth/refresh', { refreshToken: stored.tokens.refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

        accessToken = newAccessToken;
        setAccessToken(newAccessToken);

        // Cập nhật tokens trong localStorage
        if (stored) {
          storageUtil.set('user_auth', {
            ...stored,
            tokens: { ...stored.tokens, accessToken: newAccessToken, refreshToken: newRefreshToken },
          });
        }

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Không chuyển hướng ngay, để component xử lý
        console.error('Refresh token failed:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export { api, setAccessToken };

