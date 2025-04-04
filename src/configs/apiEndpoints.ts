const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/google',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  VIDEO: {
    LIST: '/videos',
    UPLOAD: '/videos/upload',
    DETAILS: (id: string) => `/videos/${id}`,
  },
  // Thêm các endpoint khác tại đây
};

export default API_ENDPOINTS;
