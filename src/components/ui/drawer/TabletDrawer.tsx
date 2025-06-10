import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/utils';
import { Menu } from 'lucide-react';
import React from 'react';

interface TabletDrawerProps {
  className?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

const TabletDrawer = ({ className, children, trigger }: TabletDrawerProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        {trigger || (
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className={cn('w-72 sm:w-80 p-4', className)}>
        <div className="flex flex-col h-full space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default TabletDrawer;
