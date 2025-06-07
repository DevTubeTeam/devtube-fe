import { IRole } from '@/types/auth';

export const USER_ROLES = {
    USER: IRole.USER,
    ADMIN: IRole.ADMIN,
} as const;

export const ROLE_PERMISSIONS = {
    [IRole.USER]: {
        canCreateVideo: true,
        canEditOwnVideo: true,
        canDeleteOwnVideo: true,
        canViewDashboard: true,
        canAccessAdmin: false,
        canManageUsers: false,
        canEditAnyVideo: false,
        canDeleteAnyVideo: false,
    },
    [IRole.ADMIN]: {
        canCreateVideo: true,
        canEditOwnVideo: true,
        canDeleteOwnVideo: true,
        canViewDashboard: true,
        canAccessAdmin: true,
        canManageUsers: true,
        canEditAnyVideo: true,
        canDeleteAnyVideo: true,
    },
} as const;

export const ROLE_LABELS = {
    [IRole.USER]: 'User',
    [IRole.ADMIN]: 'Admin',
} as const;
