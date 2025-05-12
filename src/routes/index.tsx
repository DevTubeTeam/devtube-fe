import { RedirectIfAuthenticated, RequireRole } from '@/components/guards';
import { ROUTES } from '@/constants/routes';
import { UploadProvider } from '@/contexts/UploadContext';
import { AdminLayout, ChannelLayout, DashboardLayout, HomeFeedLayout, PublicLayout, WatchLayout } from '@/layouts';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Public routes
const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/auth'));
const Search = lazy(() => import('@/pages/search'));
const Explore = lazy(() => import('@/pages/explore'));
const Watch = lazy(() => import('@/pages/watch'));
const Channel = lazy(() => import('@/pages/channel'));
// const SilentCallback = lazy(() => import('@/pages/auth/silent'));

// Authenticated routes
const MyVideos = lazy(() => import('@/pages/dashboard/videos'));
const EditVideo = lazy(() => import('@/pages/dashboard/videos/edit'));
const UploadVideo = lazy(() => import('@/pages/dashboard/upload'));
const Playlists = lazy(() => import('@/pages/dashboard/playlists'));
const UserSettings = lazy(() => import('@/pages/dashboard/settings'));

const AdminUsers = lazy(() => import('@/pages/admin/users'));
const AdminVideos = lazy(() => import('@/pages/admin/videos'));
const AdminReports = lazy(() => import('@/pages/admin/reports'));
const AdminSettings = lazy(() => import('@/pages/admin/settings'));

export const appRoutes: RouteObject[] = [
  // Public routes
  {
    path: ROUTES.HOME,
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: <HomeFeedLayout />,
        children: [
          { path: '', element: <Home /> },
          { path: ROUTES.EXPLORE.slice(1), element: <Explore /> },
          { path: ROUTES.SEARCH.slice(1), element: <Search /> },
        ],
      },
      {
        path: ROUTES.VIDEO.slice(1),
        element: <WatchLayout />,
        children: [{ path: '', element: <Watch /> }],
      },
      {
        path: ROUTES.CHANNEL(),
        element: <ChannelLayout />,
        children: [{ path: '', element: <Channel /> }],
      },
    ],
  },

  // Authenticated routes
  {
    path: ROUTES.DASHBOARD,
    element: (
      <DashboardLayout />
    ),
    children: [
      { path: '', element: <MyVideos /> },
      { path: 'videos', element: <MyVideos /> },
      { path: 'videos/edit/:id', element: <EditVideo /> },
      {
        path: 'upload', element: <UploadProvider>
          <UploadVideo />
        </UploadProvider>
      },
      { path: 'playlists', element: <Playlists /> },
      { path: 'settings', element: <UserSettings /> },
    ],
  },

  // Admin routes
  {
    path: ROUTES.ADMIN,
    element: (
      <RequireRole role="admin">
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { path: '', element: <AdminUsers /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'videos', element: <AdminVideos /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },

  // Auth route
  {
    path: ROUTES.AUTH.slice(1),
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
  },
  // {
  //   path: ROUTES.AUTH_SILENT.slice(1),
  //   element: <SilentCallback />,
  // },
];
