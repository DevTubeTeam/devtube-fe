import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import AvatarFallback from './AvatarFallback';
import AvatarImage from './AvatarImage';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'bottom-right';
  delayMs?: number;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size = 'md',
      src,
      alt,
      fallback,
      status,
      statusPosition,
      delayMs,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        <AvatarImage
          src={src}
          alt={alt || 'User avatar'}
          fallback={fallback}
          size={size || 'md'}
          status={status}
          statusPosition={statusPosition}
        />
        {!src && fallback && (
          <AvatarFallback size={size} delayMs={delayMs}>
            {fallback.slice(0, 2)}
          </AvatarFallback>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export { Avatar, AvatarFallback, AvatarImage };
