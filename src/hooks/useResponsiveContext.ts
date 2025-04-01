import { ResponsiveContext } from '@/contexts/ResponsiveContext';
import { useContext } from 'react';

export const useResponsiveContext = () => {
  const ctx = useContext(ResponsiveContext);
  if (!ctx)
    throw new Error(
      'useResponsiveContext must be used within ResponsiveProvider',
    );
  return ctx;
};
