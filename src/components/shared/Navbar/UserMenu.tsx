import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/dropdown';
import { useIsMobile } from '@/hooks/useBreakpoint';
import { Code } from 'lucide-react';
import React from 'react';

const UserMenu: React.FC = () => {
  const isMobile = useIsMobile();

  // Mock user state - in a real application, this would come from authentication context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://github.com/shadcn.png', // Example avatar URL
  };

  // For demonstration, we'll show different UI for logged in vs logged out
  const isLoggedIn = true; // This would be determined by your auth state

  if (!isLoggedIn) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
        <Button size="sm">Sign Up</Button>
      </div>
    );
  }

  const userActions = [
    {
      label: 'My Profile',
      onClick: () => console.log('Navigate to profile'),
    },
    {
      label: 'My Videos',
      onClick: () => console.log('Navigate to videos'),
    },
    {
      label: 'Saved',
      onClick: () => console.log('Navigate to saved'),
    },
    {
      label: 'Settings',
      onClick: () => console.log('Navigate to settings'),
    },
    {
      label: 'Log out',
      onClick: () => console.log('Log out user'),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-2 items-center"
        >
          <Code size={16} />
          <span>Upload</span>
        </Button>
      )}

      <Dropdown
        label={
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {!isMobile && <span className="hidden md:inline">{user.name}</span>}
          </div>
        }
        items={userActions}
        align="right"
        className="ml-1"
      />
    </div>
  );
};

export default UserMenu;
