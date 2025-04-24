import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const [menuItems] = useState([
    { label: 'Home', key: 'home' },
    { label: 'About', key: 'about' },
    { label: 'Contact', key: 'contact' },
  ]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <ul className="space-y-4">
            {menuItems.map(item => (
              <li key={item.key} className="text-lg font-medium">
                <Button variant="link" className="w-full justify-start" onClick={onClose}>
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDrawer;
