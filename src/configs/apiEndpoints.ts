const API_ENDPOINTS = {
  AUTH: {
    CALLBACK: '/api/auth/google/callback',
    SILENT: '/api/auth/silent',
    SILENT_CALLBACK: '/api/auth/silent/callback',
    LOGOUT: '/api/auth/logout',
    VERIFY_ID_TOKEN: '/api/auth/verify-id-token',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  VIDEO: {
    BASE: '/api/videos',
    SAVE_METADATA: '/api/videos/save-metadata',
    GET_ALL: '/api/videos/all',
    GET_BY_ID: (id: string) => `/api/videos/${id}`,
    UPDATE_BY_ID: (id: string) => `/api/videos/${id}`,
    DELETE_BY_ID: (id: string) => `/api/videos/${id}`,
    DETAILS: (id: string) => `/api/videos/${id}`
  },
  UPLOAD: {
    BASE: '/api/upload',
    ABORT: '/api/upload/abort',
    DELETE: '/api/upload/delete-file',
    PRESIGNED_URL: '/api/upload/presign-url',
    COMPLETE_MULTIPART_UPLOAD: '/api/upload/complete-multipart-upload',
  }
};

export default API_ENDPOINTS;
