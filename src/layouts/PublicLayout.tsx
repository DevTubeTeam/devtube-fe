import NavBar from '@/components/shared/Navbar';
import { useIsMobile, useIsTablet } from '@/hooks/useBreakpoint';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <NavBar />

      {/* Content */}
      <main
        className={`flex-1 container mx-auto w-full px-4 py-6 ${
          isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
        }`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className={`w-full border-t text-sm text-muted-foreground py-4 px-4 ${
          isMobile
            ? 'text-center'
            : 'flex justify-between flex-col md:flex-row gap-2'
        }`}
      >
        <div className="container mx-auto">
          <span>&copy; 2025 DevTube. All rights reserved.</span>
          <span className="text-xs">Built with ❤️ by DevTeam</span>
        </div>
      </footer>
    </div>
  );
}
