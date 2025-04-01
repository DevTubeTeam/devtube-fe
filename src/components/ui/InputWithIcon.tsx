// components/ui/input-with-icon.tsx
import { cn } from '@/utils';
import * as React from 'react';

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode; // nếu muốn mở rộng sau
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type = 'text', rightIcon, leftIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            (leftIcon && 'pl-10') as string | boolean | null | undefined,
            className,
          )}
          ref={ref}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

InputWithIcon.displayName = 'InputWithIcon';

export { InputWithIcon };
