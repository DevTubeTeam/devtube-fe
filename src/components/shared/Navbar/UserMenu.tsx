import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts';
import { BookmarkIcon, FolderIcon, LayoutDashboard, LogOut, User, VideoIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, handleLogout, isLoggingOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Link to="/auth" state={{ from: location }}>
          <Button variant="outline" size="sm">
            Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 cursor-pointer" type="button">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>{user?.displayName?.substring(0, 2) || '??'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{user.displayName}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="ml-1">
          {/* Thông tin cá nhân */}
          <DropdownMenuItem onClick={() => navigate(`${ROUTES.DASHBOARD}/profile`)}>
            <User className="mr-2 h-4 w-4" />
            Trang cá nhân
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Quản lý nội dung */}
          <DropdownMenuItem onClick={() => navigate(ROUTES.DASHBOARD)}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Studio của tôi
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`${ROUTES.DASHBOARD}/videos`)}>
            <VideoIcon className="mr-2 h-4 w-4" />
            Video của tôi
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Nội dung đã lưu */}
          <DropdownMenuItem onClick={() => navigate(`${ROUTES.DASHBOARD}/playlists`)}>
            <FolderIcon className="mr-2 h-4 w-4" />
            Danh sách phát
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`${ROUTES.DASHBOARD}/saved`)}>
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Video đã lưu
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Đăng xuất */}
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
