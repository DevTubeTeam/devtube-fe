import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { IGoogleCallbackRequest } from '@/types/auth';
import { useGoogleLogin } from '@react-oauth/google';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const GoogleLoginButton = () => {
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const { handleGoogleCallback, isLoggingIn } = useAuth();

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setError(null);

                const state = location.state?.from?.pathname || '/';

                if (!codeResponse.code) {
                    throw new Error('No authorization code received from Google');
                }

                const payload: IGoogleCallbackRequest = {
                    code: codeResponse.code,
                    state,
                };

                handleGoogleCallback(payload);
            } catch (error) {
                setError('Login failed. Please try again.');
            }
        },
        onError: (error) => {
            setError('Google authentication failed. Please try again.');
        },
        flow: 'auth-code',
    });

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center space-x-2 text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <Button
                onClick={() => googleLogin()}
                disabled={isLoggingIn}
                className="w-full py-6"
                size="lg"
            >
                {isLoggingIn ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <LogIn className="h-4 w-4 mr-2" />
                        <span>Continue with Google</span>
                    </>
                )}
            </Button>
        </div>
    );
};