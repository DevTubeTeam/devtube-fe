const API_BASES = {
  VIDEO: '/video',
  UPLOAD: '/upload',
};

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
    BASE: API_BASES.VIDEO,
    GET_PRESIGNED_URL: `${API_BASES.VIDEO}/presign`,
    NOTIFY_UPLOADING: `${API_BASES.VIDEO}/uploading`,
    COMPLETE_UPLOAD: `${API_BASES.VIDEO}/complete`,
    ABORT_UPLOAD: `${API_BASES.VIDEO}/abort`,
    DELETE_VIDEO: `${API_BASES.VIDEO}/delete`,
    MY_VIDEOS: `${API_BASES.VIDEO}/my-videos`,
    CREATE_THUMBNAIL_PRESIGNED_URL: `${API_BASES.VIDEO}/thumbnail/presign`,
    COMPLETE_THUMBNAIL_UPLOAD: `${API_BASES.VIDEO}/thumbnail/complete`,
    getById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    updateById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    deleteById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    getStatusById: (id: string) => `${API_BASES.VIDEO}/status/${id}`,
    publishVideo: (id: string) => `${API_BASES.VIDEO}/publish/${id}`,
    checkThumbnail: (id: string) => `${API_BASES.VIDEO}/check-thumbnail/${id}`,
  }
};

export default API_ENDPOINTS;
