// /context/UIContext.tsx
import { createContext, useState } from 'react';

export type UIState = {
  isHomeDrawerOpen: boolean;
  openCloseHomeDrawer: () => void;
};

export const UIContext = createContext<UIState | undefined>(undefined);


export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHomeDrawerOpen, setHomeDrawerOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{
        isHomeDrawerOpen,
        openCloseHomeDrawer: () => {
          setHomeDrawerOpen(prev => !prev);
        },
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
