import Loader from '@/components/ui/loader/Loader';
import { LoaderContext } from '@/contexts/LoaderContext';
import React, { ReactNode, useState } from 'react';

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const showLoader = (customMessage: string = 'Loading...') => {
    setMessage(customMessage);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setMessage('');
  };

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        message,
        showLoader,
        hideLoader,
      }}
    >
      {children}
      {isLoading && <Loader message={message} />}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
