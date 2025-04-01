import AdminSidebar from '@/components/layout/AdminSidebar';
import { useResponsive } from '@/hooks/useResponsive';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  const { isMobile } = useResponsive();

  return (
    <div className="flex min-h-screen">
      {!isMobile && <AdminSidebar />}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
