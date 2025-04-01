import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { useResponsive } from '@/hooks/useResponsive';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  const { isMobile } = useResponsive();

  return (
    <div className="flex min-h-screen">
      {!isMobile && <DashboardSidebar />}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};
