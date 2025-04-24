import NavBar from '@/components/shared/Navbar';
import DesktopDrawer from '@/components/ui/drawer/DesktopDrawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsDesktop, useIsMobile, useIsTablet } from '@/hooks/useBreakpoint';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export function HomeFeedLayout() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const [drawerOpen, setDrawerOpen] = useState(false); // 💡 State cho Sheet

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* NavBar */}
      {(isMobile || isTablet) && (
        <NavBar openCloseHomeDrawer={() => setDrawerOpen(true)} /> // 💡 truyền hàm toggle
      )}

      {/* Desktop sidebar */}
      {isDesktop && (
        <aside className="w-80 h-full overflow-y-auto">
          <DesktopDrawer />
        </aside>
      )}

      {/* Mobile & Tablet Drawer */}
      {(isTablet || isMobile) && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-64">
            <DesktopDrawer />
          </SheetContent>
        </Sheet>
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
