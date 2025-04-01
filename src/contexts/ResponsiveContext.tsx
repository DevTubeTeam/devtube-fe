import { ResponsiveState } from '@/types/responsive';
import { createContext } from 'react';

export const ResponsiveContext =
  createContext<ResponsiveState | null>(null);
