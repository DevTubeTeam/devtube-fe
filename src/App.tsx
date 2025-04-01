import { useRoutesCustom } from '@/hooks/useRoutesCustom';

function App() {
  // Edit the url to match your API endpoint
  // useEffect(() => {
  //   api
  //     .post('/auth/refresh')
  //     .then(res => setAccessToken(res.data.accessToken))
  //     .catch(() => (window.location.href = '/login'));
  // }, []);

  console.log('rendering app');

  return <>{useRoutesCustom()}</>;
}

export default App;
