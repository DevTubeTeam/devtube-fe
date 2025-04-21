import { cn } from '@/utils';
import { X } from 'lucide-react';
import * as React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center')} // Overlay
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className={cn(
          'relative w-full rounded-lg shadow-lg',
          sizeClasses[size],
        )} // Modal container
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {title && (
          <div className="flex items-center justify-between border-b px-4 py-2 dark:border-gray-700">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
        {actions && (
          <div className="flex justify-end border-t px-4 py-2 space-x-2 dark:border-gray-700">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
