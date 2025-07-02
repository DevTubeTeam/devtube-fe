const API_BASES = {
  VIDEO: '/video',
  UPLOAD: '/upload',
  COMMENT: '/comment',
  AUTH: '/auth',
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
    UPDATE_USER_PROFILE: '/auth/profile/update',
    GET_USER_PROFILE: '/auth/profile',
    CREATE_AVATAR_PRESIGNED_URL: '/auth/avatar/presigned-url',
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
    PLAYLIST: `${API_BASES.VIDEO}/playlists`,
    HOME_PAGE: (page: number, limit: number) => `${API_BASES.VIDEO}/homepage?page=${page}&limit=${limit}`,
    getById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    updateById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    deleteById: (id: string) => `${API_BASES.VIDEO}/${id}`,
    getStatusById: (id: string) => `${API_BASES.VIDEO}/status/${id}`,
    publishVideo: (id: string) => `${API_BASES.VIDEO}/publish/${id}`,
    checkThumbnail: (id: string) => `${API_BASES.VIDEO}/check-thumbnail/${id}`,
    getVideos: (params: {
      type: 'recommended' | 'popular' | 'search';
      page?: number;
      limit?: number;
      category?: string;
      timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
      query?: string;
      sortBy?: 'relevance' | 'date' | 'views';
    }) => {
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.timeRange) queryParams.append('timeRange', params.timeRange);
      if (params.query) queryParams.append('query', params.query);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      return `${API_BASES.VIDEO}?${queryParams.toString()}`;
    },
    getRelatedVideos: (videoId: string) => `${API_BASES.VIDEO}/related/${videoId}`,
    getComments: (videoId: string) => `${API_BASES.VIDEO}/comments/${videoId}`,
    createComment: (videoId: string) => `${API_BASES.VIDEO}/comments/${videoId}`,
    updatePlaylist: (playlistId: string) => `${API_BASES.VIDEO}/playlists/${playlistId}`,
    deletePlaylist: (playlistId: string) => `${API_BASES.VIDEO}/playlists/${playlistId}`,
    editVideoPlaylist: (playlistId: string) => `${API_BASES.VIDEO}/playlists/${playlistId}/videos`,
    getPlaylists: (page: number, limit: number) => `${API_BASES.VIDEO}/playlists?page=${page}&limit=${limit}`,
    getPlaylistById: (playlistId: string) => `${API_BASES.VIDEO}/playlists/${playlistId}`,
    getChannelVideos: (channelId: string) => `${API_BASES.VIDEO}/channel/${channelId}/videos`,
    getChannelPlaylists: (channelId: string) => `${API_BASES.VIDEO}/channel/${channelId}/playlists`,
    // Like video endpoints
    likeVideo: (videoId: string) => `${API_BASES.VIDEO}/like/${videoId}`,
    unlikeVideo: (videoId: string) => `${API_BASES.VIDEO}/like/${videoId}`,
    getVideoLikesCount: (videoId: string) => `${API_BASES.VIDEO}/likes/${videoId}/count`,
    getLikedVideos: `${API_BASES.VIDEO}/liked-videos`,
    isLikedVideo: (videoId: string) => `${API_BASES.VIDEO}/liked/${videoId}`,
    // Saved video endpoints
    saveVideo: (videoId: string) => `${API_BASES.VIDEO}/save/${videoId}`,
    unsaveVideo: (videoId: string) => `${API_BASES.VIDEO}/save/${videoId}`,
    getSavedVideos: `${API_BASES.VIDEO}/saved-videos`,
    isSavedVideo: (videoId: string) => `${API_BASES.VIDEO}/saved/${videoId}`,
    // Watch later endpoints
    addToWatchLater: (videoId: string) => `${API_BASES.VIDEO}/watch-later/${videoId}`,
    removeFromWatchLater: (videoId: string) => `${API_BASES.VIDEO}/watch-later/${videoId}`,
    getWatchLaterVideos: `${API_BASES.VIDEO}/watch-later`,
    isInWatchLater: (videoId: string) => `${API_BASES.VIDEO}/watch-later/${videoId}`,
  },
  CHANNEL: {
    getById: (channelId: string) => `${API_BASES.AUTH}/channel/${channelId}`,
    search: (keyword: string, page: number = 1, limit: number = 10) =>
      `${API_BASES.AUTH}/channels/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`,
    subscribe: (channelId: string) => `${API_BASES.AUTH}/channel/${channelId}/subscribe`,
    unsubscribe: (channelId: string) => `${API_BASES.AUTH}/channel/${channelId}/unsubscribe`,
    isSubscribed: (channelId: string) => `${API_BASES.AUTH}/channel/${channelId}/is-subscribed`,
    subscribersCount: (channelId: string) => `${API_BASES.AUTH}/channel/${channelId}/subscribers-count`,
    getSubscribedChannels: (page: number = 1, limit: number = 10) =>
      `${API_BASES.AUTH}/channels/subscribed?page=${page}&limit=${limit}`,
  },
};

export default API_ENDPOINTS;
