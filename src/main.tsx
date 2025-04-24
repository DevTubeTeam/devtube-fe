import { AuthProvider, LoaderProvider, ThemeProvider, UIProvider } from '@/providers';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
const queryClient = new QueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log(googleClientId, 'googleClientId');

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <ThemeProvider>
            <UIProvider>
              <GoogleOAuthProvider clientId={googleClientId}>
                <App />
              </GoogleOAuthProvider>
            </UIProvider>
          </ThemeProvider>
        </LoaderProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </AuthProvider>,
  // </StrictMode>,
);
