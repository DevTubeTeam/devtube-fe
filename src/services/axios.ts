import axios, { AxiosInstance } from 'axios';

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL, // thay bằng URL thật
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
        const res = await api.post('/auth/refresh');
        accessToken = res.data.accessToken;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
