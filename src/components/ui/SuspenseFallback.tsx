import { LoaderContext } from '@/contexts/LoaderContext';
import { useContext, useEffect } from 'react';

const SuspenseFallback = () => {
  const loaderContext = useContext(LoaderContext);

  if (!loaderContext) {
    throw new Error('LoaderContext is undefined. Please ensure it is provided.');
  }

  const { showLoader, hideLoader } = loaderContext;

  useEffect(() => {
    // Khi Suspense bắt đầu loading
    showLoader('Loading...');

    // Khi Suspense kết thúc (component lazy load xong)
    return () => {
      hideLoader();
    };
  }, [showLoader, hideLoader]);

  return null; // Loader đã render qua LoaderProvider rồi
};

export default SuspenseFallback;
