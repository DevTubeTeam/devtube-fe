// components/ui/dropdown.tsx
import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

interface DropdownProps {
  label: React.ReactNode; // Thay đổi từ string thành React.ReactNode
  items: { label: string; onClick: () => void }[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  label,
  items,
  align = 'left',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={cn('relative inline-block text-left', className)}
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {label}
        <svg
          className="ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-48 rounded-md border bg-popover shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <ul className="py-1 text-sm text-foreground">
            {items.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
