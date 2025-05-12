import { useContext } from 'react';
import { LoaderContext, LoaderContextProps } from '../contexts/LoaderContext';

export const useLoader = (): LoaderContextProps => {
  const loaderContext = useContext(LoaderContext);

  if (!loaderContext) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return loaderContext;
};

export default useLoader;
