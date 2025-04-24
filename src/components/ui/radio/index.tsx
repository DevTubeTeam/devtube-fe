import { cn } from '@/utils';
import * as React from 'react';

type RadioProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label
        className={cn(
          'flex items-center space-x-2 text-sm text-foreground',
          className,
        )}
      >
        <input
          type="radio"
          className={cn(
            'h-4 w-4 rounded-full border border-input text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          ref={ref}
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  },
);

Radio.displayName = 'Radio';

export { Radio };
