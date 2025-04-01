import { ResponsiveContext } from '@/contexts/ResponsiveContext';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveState } from '@/types/responsive';

export const ResponsiveProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isDesktop, isMobile, isTablet } = useResponsive();

  // Optional: define helper booleans
  

  const enhancedResponsive: ResponsiveState & {
    isMobile: boolean;
    isDesktop: boolean;
  } = {
    ...responsive,
    isMobile,
    isDesktop,
  };

  return (
    <ResponsiveContext.Provider value={enhancedResponsive}>
      {children}
    </ResponsiveContext.Provider>
  );
};
