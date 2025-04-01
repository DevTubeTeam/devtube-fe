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

  return breakpoint;
};

export const useIsMobile = () => {
  const bp = useBreakpoint();
  return bp === 'sm';
};

export const useIsTablet = () => {
  const bp = useBreakpoint();
  return bp === 'md';
};

export const useIsDesktop = () => {
  const bp = useBreakpoint();
  // desktop từ lg trở lên
  return bp === 'lg' || bp === 'xl' || bp === '2xl';
};

export const useIsLargerThan = (bpKey: BreakpointKey) => {
  const bp = useBreakpoint();
  const keys = Object.keys(BREAKPOINTS) as BreakpointKey[];
  return keys.indexOf(bp) > keys.indexOf(bpKey);
};

export const useIsSmallerThan = (bpKey: BreakpointKey) => {
  const bp = useBreakpoint();
  const keys = Object.keys(BREAKPOINTS) as BreakpointKey[];
  return keys.indexOf(bp) < keys.indexOf(bpKey);
};
