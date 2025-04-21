import { createContext } from 'react';

export interface LoaderContextProps {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
  message: string;
}

export const LoaderContext = createContext<LoaderContextProps | undefined>(
  undefined,
);
