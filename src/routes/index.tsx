import { ProtectedRoute } from '@/components/auth';
import { ROUTES } from '@/constants/routes';
import { AdminLayout, ChannelLayout, DashboardLayout, HomeFeedLayout, PublicLayout, WatchLayout } from '@/layouts';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Public routes
const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/auth'))
const Search = lazy(() => import('@/pages/search'));
const Explore = lazy(() => import('@/pages/explore'));
const Watch = lazy(() => import('@/pages/watch'));
const Channel = lazy(() => import('@/pages/channel'));

// Authenticated routes
const Dashboard = lazy(() => import('@/pages/dashboard'));
const MyVideos = lazy(() => import('@/pages/dashboard/videos'));
const EditVideo = lazy(() => import('@/pages/dashboard/videos/edit'));
const Playlists = lazy(() => import('@/pages/dashboard/playlists'));
const UserSettings = lazy(() => import('@/pages/dashboard/settings'));
const UserProfile = lazy(() => import('@/pages/dashboard/profile'));
const SavedVideo = lazy(() => import('@/pages/dashboard/saved'));

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
          {
            path: ROUTES.CHANNELS,
            element: (
              <ProtectedRoute role='user'>
                <Channel />
              </ProtectedRoute>
            ),
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



    ],
  },
  // Authenticated routes
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute role='user'>
        <DashboardLayout />
      </ProtectedRoute>

    ),
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'videos', element: <MyVideos /> },
      { path: 'videos/edit/:id', element: <EditVideo /> },
      { path: 'playlists', element: <Playlists /> },
      { path: 'settings', element: <UserSettings /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'saved', element: <SavedVideo /> },
    ],
  },
  // Admin routes
  {
    path: ROUTES.ADMIN,
    element: (
      <ProtectedRoute role='admin'>
        <AdminLayout />
      </ProtectedRoute>
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
      <Login />
    ),
  }
];
