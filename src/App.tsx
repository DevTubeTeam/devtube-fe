import { ScrollToTop } from '@/components/common/ScrollToTop';
import SuspenseFallback from '@/components/ui/SuspenseFallback';
import { useRoutesCustom } from '@/hooks/useRoutesCustom';
import { Suspense } from 'react';

function App() {
  const routes = useRoutesCustom();

  return <>
    <ScrollToTop />
    <Suspense fallback={<SuspenseFallback />}>{routes}</Suspense>
    <ScrollToTop />
  </>;
}

export default App;
