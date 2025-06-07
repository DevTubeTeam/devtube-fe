import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { useAuth } from '@/contexts';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, handleLogout, isLoggingOut } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Link to="/auth" state={{ from: location }}>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>{user?.displayName?.substring(0, 2) || '??'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{user.displayName}</span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="ml-1">
          <DropdownMenuItem onClick={() => console.log('Navigate to profile')}>My Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Navigate to videos')}>My Videos</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Navigate to saved')}>Saved</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Navigate to settings')}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
