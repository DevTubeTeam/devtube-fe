import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import authService from '@/services/authService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';

const SilentCallback = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      authService
        .handleSilentCallback(code)
        .then(res => authService.verifyIdToken(res.data.data.idToken))
        .then(res => {
          setTokens({
            ...res.data.data,
            accessToken: '',
            refreshToken: '',
            idToken: '',
          });
          navigate('/', { replace: true });
        })
        .catch(err => {
          console.warn('Silent login failed', err);
          setError('Silent login failed. Redirecting to login page...');
          setTimeout(() => navigate('/login'), 3000);
        });
    }
  }, [navigate, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 text-center">
          {!error ? (
            <>
              <Spinner className="mx-auto mb-4" />
              <p className="text-gray-700">Processing silent login...</p>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SilentCallback;
