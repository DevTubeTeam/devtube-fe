const redirectToGoogleSilentLogin = () => {
  console.log('Redirecting to Google OAuth for silent login...');
  if (!import.meta.env.VITE_GOOGLE_REDIRECT_URI || !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.error('Environment variables for Google OAuth are not set.');
    return;
  }

  const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI!);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&prompt=none`;

  window.location.href = googleOAuthUrl;
};

export default redirectToGoogleSilentLogin;
