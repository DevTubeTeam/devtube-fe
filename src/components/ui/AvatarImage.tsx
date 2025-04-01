import { cn } from '@/utils';
import { Image } from 'antd';
import * as React from 'react';

export interface AvatarImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'bottom-right';
  className?: string;
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  (
    {
      src,
      alt = 'User avatar',
      fallback,
      size = 'md',
      status,
      statusPosition = 'bottom-right',
      className,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = React.useState(false);

    const sizeMap = {
      sm: 32, // 8 * 4 = 32px
      md: 40, // 10 * 4 = 40px
      lg: 48, // 12 * 4 = 48px
      xl: 64, // 16 * 4 = 64px
    };

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    };

    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };

    const statusPositionClasses = {
      'top-right': '-top-1 -right-1',
      'bottom-right': '-bottom-1 -right-1',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden bg-muted',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src && !hasError ? (
          <Image
            src={src}
            alt={alt}
            width={sizeMap[size]}
            height={sizeMap[size]}
            preview={false}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted font-medium uppercase text-muted-foreground">
            {fallback ? fallback.slice(0, 2) : '?'}
          </div>
        )}

        {status && (
          <span
            className={cn(
              'absolute block rounded-full border-2 border-background',
              statusPositionClasses[statusPosition],
              statusClasses[status],
              size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
            )}
          />
        )}
      </div>
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

export default AvatarImage;
