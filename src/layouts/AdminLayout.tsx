import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
