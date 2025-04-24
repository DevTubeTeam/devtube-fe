import SuspenseFallback from '@/components/ui/SuspenseFallback';
import { useRoutesCustom } from '@/hooks/useRoutesCustom';
import { Suspense } from 'react';

function App() {
  const routes = useRoutesCustom();

  return <Suspense fallback={<SuspenseFallback />}>{routes}</Suspense>;
}

export default App;
