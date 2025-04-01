import { HomeFeedLayout } from '@/layouts/HomeFeedLayout';
import PublicLayout from '@/layouts/PublicLayout';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Public routes
const Home = lazy(() => import('@/pages/home'));
// const Login = lazy(() => import('@/pages/auth'));
const Search = lazy(() => import('@/pages/search'));
const Explore = lazy(() => import('@/pages/explore'));
// const NotFound = lazy(() => import('@/pages/not-found'));
// const AccessDenied = lazy(
//   () => import('@/pages/access-denied'),
// );

// Authenticated routes
// const MyVideos = lazy(
//   () => import('@/pages/dashboard/videos'),
// );
// const EditVideo = lazy(    
//   () => import('@/pages/dashboard/videos/edit'),
// );
// const UploadVideo = lazy(
//   () => import('@/pages/dashboard/upload'),
// );
// const Playlists = lazy(
//   () => import('@/pages/dashboard/playlists'),
// );
// const UserSettings = lazy(
//   () => import('@/pages/dashboard/settings'),
// );

// const AdminUsers = lazy(
//   () => import('@/pages/admin/users'),
// );
// const AdminVideos = lazy(
//   () => import('@/pages/admin/videos'),
// );
// const AdminReports = lazy(
//   () => import('@/pages/admin/reports'),
// );
// const AdminSettings = lazy(
//   () => import('@/pages/admin/settings'),
// );

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: <HomeFeedLayout />,
        children: [
          { path: '', element: <Home /> },
          { path: 'explore', element: <Explore /> },
          { path: 'search', element: <Search /> },
        ],
      },
      // {
      //   path: 'video/:id',
      //   element: <WatchLayout />,
      //   children: [{ path: '', element: <Watch /> }],
      // },
      // {
      //   path: 'channel/:id',
      //   element: <ChannelLayout />,
      //   children: [{ path: '', element: <Channel /> }],
      // },
      // { path: 'login', element: <Login /> },
    ],
  },

  // Authenticated routes
  //   {
  //     path: '/dashboard',
  //     element: (
  //       <RequireAuth>
  //         <DashboardLayout />
  //       </RequireAuth>
  //     ),
  //     children: [
  //       { path: '', element: <MyVideos /> },
  //       { path: 'videos', element: <MyVideos /> },
  //       { path: 'videos/edit/:id', element: <EditVideo /> },
  //       { path: 'upload', element: <UploadVideo /> },
  //       { path: 'playlists', element: <Playlists /> },
  //       { path: 'settings', element: <UserSettings /> },
  //     ],
  //   },

  //   // Admin routes
  //   {
  //     path: '/admin',
  //     element: (
  //       <RequireRole role="admin">
  //         <AdminLayout />
  //       </RequireRole>
  //     ),
  //     children: [
  //       { path: '', element: <AdminUsers /> },
  //       { path: 'users', element: <AdminUsers /> },
  //       { path: 'videos', element: <AdminVideos /> },
  //       { path: 'reports', element: <AdminReports /> },
  //       { path: 'settings', element: <AdminSettings /> },
  //     ],
  //   },

  //   { path: '/403', element: <AccessDenied /> },
  //   { path: '*', element: <NotFound /> },
];
