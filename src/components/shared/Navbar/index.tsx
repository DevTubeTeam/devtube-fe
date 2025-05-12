import { ModeToggle } from '@/components/common/ModeToggle';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useIsDesktop, useIsMobile, useIsTablet } from '@/hooks/useBreakpoint';
import { Menu, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import SearchInput from './SearchInput';
import UserMenu from './UserMenu';

interface NavBarProps {
  openCloseHomeDrawer: () => void;
}

const NavBar = ({ openCloseHomeDrawer }: NavBarProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="w-full flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {isMobile && isTablet && (
            <Button variant="ghost" size="icon" onClick={openCloseHomeDrawer}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>

        {/* Center section: Search (hidden on mobile unless toggled) */}
        {(!isMobile || mobileSearchVisible) && (
          <div
            className={`${isMobile ? 'absolute inset-x-0 top-14 z-50 px-4 py-2 bg-background border-b' : 'flex-1 max-w-md mx-4'
              }`}
          >
            <SearchInput />
          </div>
        )}

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Upload button */}
          <Link to={ROUTES.DASHBOARD_VIDEOS}>
            <Button variant="ghost" size="icon">
              <Upload />
            </Button>
          </Link>

          {/* Mobile search toggle */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchVisible(!mobileSearchVisible)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Theme toggle visible on tablet and up */}
          {(isTablet || isDesktop) && <ModeToggle />}

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
