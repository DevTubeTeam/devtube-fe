import { UIContext } from '@/contexts';
import { useState } from 'react';

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
