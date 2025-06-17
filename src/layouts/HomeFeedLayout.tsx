import DesktopDrawer from '@/components/shared/Drawer/DesktopDrawer';
import { Outlet } from 'react-router-dom';

export function HomeFeedLayout() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-hidden">
      <aside className="w-80 h-full overflow-y-auto">
        <DesktopDrawer />
      </aside>
      {/* Main content */}
      <main className="flex-1 h-full min-h-0 overflow-y-auto px-6 py-8 text-base">
        <div className="max-w-5x h-full min-h-0 flex flex-col">
          <Outlet />
          {/* Fallback nếu không có children */}
          {/* <div className="text-center text-muted-foreground mt-20">Chào mừng bạn đến với DevHub!</div> */}
        </div>
      </main>
    </div>
  );
}
