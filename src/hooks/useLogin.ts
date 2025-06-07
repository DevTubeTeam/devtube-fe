import authService from '@/services/auth.service';
import { IGoogleCallbackRequest, IGoogleCallbackResponse } from '@/types/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => {
    const googleCallbackMutation = useMutation<HttpResponse<IGoogleCallbackResponse>, Error, IGoogleCallbackRequest>({
        mutationKey: ['googleCallback'],
        mutationFn: authService.handleGoogleCallback,
    });

    const checkSessionMutation = useMutation<HttpResponse<null>, Error, void>({
        mutationKey: ['checkSession'],
        mutationFn: authService.checkSession,
    });

    const getAuthenticatedUserQuery = useQuery({
        queryKey: ['me'],
        queryFn: authService.getAuthenticatedUser,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: false,
    });


    const logoutMutation = useMutation<HttpResponse<null>, Error, void>({
        mutationKey: ['logout'],
        mutationFn: authService.handleLogout,
    });

    return {
        googleCallbackMutation,
        logoutMutation,
        checkSessionMutation,
        getAuthenticatedUserQuery
    };
};
