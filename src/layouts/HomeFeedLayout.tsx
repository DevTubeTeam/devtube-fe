import { Button } from '@/components/ui/button';
import {
  DesktopDrawer,
  MobileDrawer,
  TabletDrawer,
} from '@/components/ui/drawer';
import { useIsDesktop, useIsMobile, useIsTablet } from '@/hooks/useBreakpoint';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export function HomeFeedLayout() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Desktop sidebar */}
      {isDesktop && (
        <aside className="w-80 h-full overflow-y-auto">
          <DesktopDrawer />
        </aside>
      )}

      {/* Tablet sidebar with drawer */}
      {isTablet && (
        <TabletDrawer
          className="h-screen sticky top-0"
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-10"
            >
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        >
          <DesktopDrawer />
        </TabletDrawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-10"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </Button>
          <MobileDrawer
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
          />
        </>
      )}

      {/* Main content */}
      <main
        className={`flex-1 h-full overflow-y-auto ${isMobile ? 'px-2 py-4' : 'px-6 py-8'} ${
          isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
