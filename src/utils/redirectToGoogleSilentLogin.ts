const redirectToGoogleSilentLogin = () => {
  const redirectUri = encodeURIComponent('http://localhost:3000/auth/silent/callback');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&prompt=none`;

  window.location.href = googleOAuthUrl;
};

export default redirectToGoogleSilentLogin;
