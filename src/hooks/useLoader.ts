import { useContext } from 'react';
import { LoaderContext, LoaderContextProps } from '../contexts/LoaderContext';

export const useLoader = (): LoaderContextProps => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return context;
};

export default useLoader;
