export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  SEARCH: '/search',
  VIDEO: '/video/:videoId',
  CHANNELS: '/channels',
  CHANNEL: (id: string = ':id') => `/channel/${id}`,

  AUTH: '/auth',
  AUTH_SILENT: '/auth/silent/callback',

  DASHBOARD: '/dashboard',
  DASHBOARD_VIDEOS: '/dashboard/videos',
  DASHBOARD_EDIT_VIDEO: (id: string = ':id') => `/dashboard/videos/edit/${id}`,
  DASHBOARD_UPLOAD: '/dashboard/upload',
  DASHBOARD_PLAYLISTS: '/dashboard/playlists',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PROFILE: '/dashboard/profile',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_VIDEOS: '/admin/videos',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
};
