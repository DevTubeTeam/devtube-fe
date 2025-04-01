import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const avatarFallbackVariants = cva(
  'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarFallbackVariants> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, size, children, delayMs = 600, ...props }, ref) => {
    const [isShown, setIsShown] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsShown(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }, [delayMs]);

    if (!isShown) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(avatarFallbackVariants({ size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AvatarFallback.displayName = 'AvatarFallback';

export default AvatarFallback;
