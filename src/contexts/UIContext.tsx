// /context/UIContext.tsx
import { createContext } from 'react';

export type UIState = {
  isHomeDrawerOpen: boolean;
  openCloseHomeDrawer: () => void;
};

export const UIContext = createContext<UIState | undefined>(undefined);
