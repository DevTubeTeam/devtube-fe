import React from 'react';
import { useBreakpoint } from '@/hooks';

export const withResponsive = <P extends object>(
  Component: React.ComponentType<
    P & { breakpoint: string }
  >,
): React.FC<P> => {
  return function ResponsiveComponent(props: P) {
    const breakpoint = useBreakpoint();
    return <Component {...props} breakpoint={breakpoint} />;
  };
};
