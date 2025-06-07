# Authentication Flow Implementation

## Overview

This implementation provides a complete authentication flow using Google OAuth with the following features:

- **Google OAuth Login**: Users can sign in using their Google account
- **Silent Login**: Automatic re-authentication when Google session is still valid
- **HttpOnly Cookies**: Secure token storage managed by backend
- **Automatic Token Refresh**: Transparent token renewal using interceptors
- **Role-based Access Control**: Support for user and admin roles
- **Route Protection**: Guards for authenticated and role-specific routes

## Components

### Core Authentication

- `AuthProvider`: Main authentication context provider
- `AuthContext`: Authentication context with user state and methods
- `useAuth`: Hook to access authentication state and methods
- `usePermissions`: Hook for checking user permissions

### Route Guards

- `RequireAuth`: Protects routes that require authentication
- `RequireRole`: Protects routes that require specific roles
- `RedirectIfAuthenticated`: Redirects authenticated users away from auth pages

### Pages

- `LoginPage`: Google OAuth login interface
- `SilentCallbackPage`: Handles silent login callback
- `DashboardPage`: Main dashboard for authenticated users
- `PermissionTestPage`: Development tool for testing permissions

## API Endpoints

The following endpoints are used for authentication:

- `POST /auth/google` - Handle Google OAuth callback
- `POST /auth/silent` - Handle silent login
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/verify-id-token` - Verify ID token and get user info

## Environment Variables

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Usage

### Basic Setup

1. Wrap your app with `AuthProvider` in `main.tsx`
2. Use `RequireAuth` and `RequireRole` guards in your routes
3. Access authentication state with `useAuth` hook

### Example Route Protection

```tsx
// Protect dashboard routes
{
  path: '/dashboard',
  element: (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  ),
  children: [...]
}

// Protect admin routes
{
  path: '/admin',
  element: (
    <RequireRole allowedRoles={[IRole.ADMIN]}>
      <AdminLayout />
    </RequireRole>
  ),
  children: [...]
}
```

### Using Authentication State

```tsx
const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, canManageUsers } = usePermissions();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.displayName}</p>}
      {isAdmin && <AdminPanel />}
      {canManageUsers && <UserManagement />}
    </div>
  );
};
```

## Flow Details

### 1. App Initialization

- `AuthProvider` calls `/auth/verify-id-token` on startup
- If valid, sets user state and `isAuthenticated: true`
- If invalid, sets `isAuthenticated: false`

### 2. Login Flow

- User clicks "Sign in with Google"
- Gets authorization code from Google
- Sends code to `/auth/google`
- Backend sets HttpOnly cookies
- Frontend calls `/auth/verify-id-token` to get user info
- Redirects to dashboard or intended page

### 3. Silent Login Flow

- Google redirects to `/auth/silent/callback?code=xyz`
- Frontend sends code to `/auth/silent`
- Backend sets ID token cookie
- Frontend verifies token and gets user info
- Redirects to intended page

### 4. Token Refresh Flow

- API call returns 401 (token expired)
- Axios interceptor calls `/auth/refresh`
- Backend refreshes tokens and sets new cookies
- Original API call is retried automatically

### 5. Logout Flow

- User clicks logout
- Frontend calls `/auth/logout`
- Backend clears all auth cookies
- Frontend clears user state and redirects to login

## Security Features

- **HttpOnly Cookies**: Tokens stored in secure, HttpOnly cookies
- **Automatic Refresh**: Transparent token renewal
- **CSRF Protection**: State parameter in OAuth flow
- **Role-based Access**: Granular permission system
- **Route Protection**: Guards prevent unauthorized access

## Development Tools

- **Permission Test Page**: `/dashboard/permissions-test` (dev only)
- **Debug Panel**: Shows user and permission state in dashboard
- **Console Logging**: Detailed logs for authentication events

## Role System

### Available Roles

- `IRole.USER`: Regular user with basic permissions
- `IRole.ADMIN`: Administrator with full permissions

### Permission Examples

- `canCreateVideo`: Create new videos
- `canEditOwnVideo`: Edit own videos
- `canDeleteOwnVideo`: Delete own videos
- `canAccessAdmin`: Access admin panel
- `canManageUsers`: Manage other users

### Dynamic Permissions

- `canEditVideo(isOwner)`: Edit video based on ownership
- `canDeleteVideo(isOwner)`: Delete video based on ownership

## Best Practices

1. **Always use guards**: Protect routes with appropriate guards
2. **Check permissions**: Use `usePermissions` for UI conditional rendering
3. **Handle loading states**: Show loading indicators during auth checks
4. **Error handling**: Gracefully handle authentication failures
5. **Secure cookies**: Ensure backend sets secure, HttpOnly cookies
6. **HTTPS only**: Use HTTPS in production for cookie security
