const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: '/auth/google',
    SILENT: '/auth/silent',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_ID_TOKEN: '/auth/verify',
    CHECK_SESSION: '/auth/check-session',
    ME: '/auth/me',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  VIDEO: {
    BASE: '/videos',
    SAVE_METADATA: '/videos/save-metadata',
    GET_ALL: '/videos/all',
    GET_BY_ID: (id: string) => `/videos/${id}`,
    UPDATE_BY_ID: (id: string) => `/videos/${id}`,
    DELETE_BY_ID: (id: string) => `/videos/${id}`,
    DETAILS: (id: string) => `/videos/${id}`
  },
  UPLOAD: {
    BASE: '/upload',
    ABORT: '/upload/abort',
    DELETE: '/upload/delete-file',
    PRESIGNED_URL: '/upload/presign-url',
    COMPLETE_MULTIPART_UPLOAD: '/upload/complete-multipart-upload',
  }
};

export default API_ENDPOINTS;
