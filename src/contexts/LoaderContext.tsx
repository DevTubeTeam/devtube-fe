import Loader from '@/components/ui/loader';
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface LoaderContextProps {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  message: string;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const useLoader = (): LoaderContextProps => {
  const loaderContext = useContext(LoaderContext);
  if (!loaderContext) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return loaderContext;
};

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = useCallback((msg: string = 'Loading...') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage('');
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, message, showLoader, hideLoader }
    }>
      {children}
      {isLoading && <Loader message={message} />}
    </LoaderContext.Provider>
  );
};
