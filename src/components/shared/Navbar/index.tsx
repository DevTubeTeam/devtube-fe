import { ModeToggle } from '@/components/common/ModeToggle';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { Menu, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SearchInput from './SearchInput';
import UserMenu from './UserMenu';

interface NavBarProps {
  openCloseHomeDrawer: () => void;
}

const NavBar = ({ openCloseHomeDrawer }: NavBarProps) => {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="w-full flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={openCloseHomeDrawer}>
            <Menu className="h-5 w-5" />
          </Button>
          <Logo />
        </div>

        {/* Center section: Search */}
        <div className="flex-1 max-w-md mx-4">
          <SearchInput />
        </div>

        <div className="flex items-center gap-2">
          <Link to={`${ROUTES.DASHBOARD_VIDEOS}?openUpload=true`}>
            <Button variant="ghost" size="icon">
              <Upload />
            </Button>
          </Link>

          {/* Theme toggle */}
          <ModeToggle />

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
