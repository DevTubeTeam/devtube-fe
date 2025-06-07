import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api: AxiosInstance = axios.create(axiosConfig);

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.message === 'access_token_expired'
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh', {}, { withCredentials: true });

        if (response.status === 200) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        const response = await api.post('/auth/logout');

        if (response.status === 200 && response.data?.status && response.data.statusCode === 200) {
          window.location.href = '/auth';
        } else {
          console.error('Logout failed:', response.data);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

