import { ModeToggle } from '@/components/common/ModeToggle';
import { Button } from '@/components/ui/Button';
import { useIsDesktop, useIsMobile, useIsTablet } from '@/hooks/useBreakpoint';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';
import SearchInput from './SearchInput';
import UserMenu from './UserMenu';

const NavBar = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="w-full flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo />
        </div>

        {/* Center section: Search (hidden on mobile unless toggled) */}
        {(!isMobile || mobileSearchVisible) && (
          <div
            className={`${
              isMobile
                ? 'absolute inset-x-0 top-14 z-50 px-4 py-2 bg-background border-b'
                : 'flex-1 max-w-md mx-4'
            }`}
          >
            <SearchInput />
          </div>
        )}

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Theme toggle visible on tablet and up */}
          {(isTablet || isDesktop) && <ModeToggle />}

          {/* User menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background p-6 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
              >
                Close
              </Button>
            </div>
            <MobileDrawer
              visible={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
