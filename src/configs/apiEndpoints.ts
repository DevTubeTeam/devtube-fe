const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/google',
    REFRESH: '/auth/refresh',
    CALLBACK: '/auth/google/callback', // Thêm endpoint callback
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
