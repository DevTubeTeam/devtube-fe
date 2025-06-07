import { AuthProvider, ThemeProvider, UIProvider } from '@/contexts';
import { LoaderProvider } from '@/contexts/LoaderContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoaderProvider>
          <ThemeProvider>
            <UIProvider>
              <GoogleOAuthProvider clientId={googleClientId}>
                <App />
              </GoogleOAuthProvider>
            </UIProvider>
          </ThemeProvider>
        </LoaderProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
