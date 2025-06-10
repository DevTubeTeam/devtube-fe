import { ScrollToTop } from '@/components/common/ScrollToTop';
import SuspenseFallback from '@/components/ui/SuspenseFallback';
import { useRoutesCustom } from '@/hooks/useRoutesCustom';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const routes = useRoutesCustom();

  return <>
    <ScrollToTop />
    <Suspense fallback={<SuspenseFallback />}>{routes}</Suspense>
    <ScrollToTop />
    <ToastContainer position="bottom-right" autoClose={5000} />
  </>;
}

export default App;
