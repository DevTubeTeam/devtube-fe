import {
  BreakpointKey,
  BREAKPOINTS,
} from '@/utils/breakpoints';
import { useEffect, useState } from 'react';

function getCurrentBreakpoint(): BreakpointKey {
  const width = window.innerWidth;
  const entries = Object.entries(BREAKPOINTS) as [
    BreakpointKey,
    number,
  ][];
  for (let i = entries.length - 1; i >= 0; i--) {
    const [key, value] = entries[i];
    if (width >= value) return key;
  }
  return 'sm';
}

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] =
    useState<BreakpointKey>(() => {
      if (typeof window === 'undefined') return 'sm';
      return getCurrentBreakpoint();
    });

  useEffect(() => {
    const handleResize = () => {
      const current = getCurrentBreakpoint();
      setBreakpoint(current);
    };
    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
  };
};

export const useIsMobile = () => {
  const { isMobile } = useBreakpoint();
  return isMobile;
};

export const useIsTablet = () => {
  const { isTablet } = useBreakpoint();
  return isTablet;
};

export const useIsDesktop = () => {
  const { isDesktop } = useBreakpoint();
  return isDesktop;
};

export const useIsLargerThan = (bpKey: BreakpointKey) => {
  const { breakpoint } = useBreakpoint();
  const keys = Object.keys(BREAKPOINTS) as BreakpointKey[];
  return keys.indexOf(breakpoint) > keys.indexOf(bpKey);
};

export const useIsSmallerThan = (bpKey: BreakpointKey) => {
  const { breakpoint } = useBreakpoint();
  const keys = Object.keys(BREAKPOINTS) as BreakpointKey[];
  return keys.indexOf(breakpoint) < keys.indexOf(bpKey);
};
