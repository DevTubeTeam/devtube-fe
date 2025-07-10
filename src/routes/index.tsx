import { ProtectedRoute } from '@/components/auth';
import { ROUTES } from '@/constants/routes';
import { DashboardLayout, HomeFeedLayout, PublicLayout, WatchLayout } from '@/layouts';
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
const MyVideos = lazy(() => import('@/pages/dashboard/videos'));
const EditVideo = lazy(() => import('@/pages/dashboard/videos/edit'));
const DashboardPlaylists = lazy(() => import('@/pages/dashboard/playlists'));
const Playlists = lazy(() => import('@/pages/playlist'));
const PlaylistEdit = lazy(() => import('@/pages/playlist/edit'));
const UserProfile = lazy(() => import('@/pages/dashboard/profile'));
const DashboardPlaylistsEditPage = lazy(() => import('@/pages/dashboard/playlists/edit'));
const ChannelListPage = lazy(() => import('@/pages/channels'));
const SavedPage = lazy(() => import('@/pages/saved'));
const WatchLaterPage = lazy(() => import('@/pages/watch-later'));
const LikedPage = lazy(() => import('@/pages/liked'));



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
          {
            path: ROUTES.EXPLORE.slice(1), element: (
              <ProtectedRoute role='user'>
                <Explore />
              </ProtectedRoute>
            )
          },
          { path: ROUTES.SEARCH.slice(1), element: <Search /> },
          {
            path: ROUTES.CHANNEL().slice(1),
            element: (
              <ProtectedRoute role='user'>
                <Channel />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PLAYLISTS,
            element: (
              <ProtectedRoute role='user'>
                <Playlists />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PLAYLISTS,
            element: (
              <ProtectedRoute role='user'>
                <Playlists />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.PLAYLIST(),
            element: (
              <ProtectedRoute role='user'>
                <PlaylistEdit />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.VIDEO.slice(1),
            element: <WatchLayout />,
            children: [{ path: '', element: <Watch /> }],
          },
          {
            path: ROUTES.CHANNELS,
            element: (
              <ProtectedRoute role='user'>
                <ChannelListPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.SAVED,
            element: (
              <ProtectedRoute role='user'>
                <SavedPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.WATCH_LATER,
            element: (
              <ProtectedRoute role='user'>
                <WatchLaterPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.LIKED,
            element: (
              <ProtectedRoute role='user'>
                <LikedPage />
              </ProtectedRoute>
            ),
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
      { path: '', element: <MyVideos /> },
      { path: 'videos', element: <MyVideos /> },
      { path: 'videos/edit/:id', element: <EditVideo /> },
      { path: 'playlists', element: <DashboardPlaylists /> },
      { path: 'playlists/edit/:id', element: <DashboardPlaylistsEditPage /> },
      { path: 'profile', element: <UserProfile /> },
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
