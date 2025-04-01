import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/Home'))

export const homeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    meta: {
      requiresAuth: false,
    },
  },
]
