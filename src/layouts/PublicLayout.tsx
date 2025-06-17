import NavBar from '@/components/shared/Navbar';
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <NavBar />

      {/* Content */}
      <main className="flex-1 w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
