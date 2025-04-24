const API_ENDPOINTS = {
  AUTH: {
    CALLBACK: '/auth/google/callback',
    SILENT: '/auth/silent',
    SILENT_CALLBACK: '/auth/silent/callback',
    LOGOUT: '/auth/logout',
    VERIFY_ID_TOKEN: '/auth/verify-id-token',
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
