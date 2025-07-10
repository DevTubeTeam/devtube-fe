import DesktopDrawer from '@/components/shared/Drawer/DesktopDrawer';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// export function HomeFeedLayout() {
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

//   return (
//     <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-hidden">
//       {/* Sidebar desktop */}
//       <aside className="hidden md:block w-80 h-full overflow-y-auto flex-shrink-0">
//         <DesktopDrawer />
//       </aside>
//       {/* Mobile menu button */}
//       <button
//         className="block md:hidden fixed top-4 left-4 z-50 bg-white/80 rounded-full p-2 shadow"
//         onClick={() => setMobileDrawerOpen(true)}
//         aria-label="Mở menu"
//       >
//         <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>
//       {/* Mobile Drawer overlay */}
//       {mobileDrawerOpen && (
//         <DesktopDrawer isMobileDrawer onClose={() => setMobileDrawerOpen(false)} />
//       )}
//       {/* Main content */}
//       <main className="flex-1 h-full min-h-0 overflow-y-auto px-2 sm:px-4 py-6 md:py-8 text-base w-full">
//         <div className="max-w-5xl h-full min-h-0 flex flex-col mx-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }


export function HomeFeedLayout() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:block w-80 h-full overflow-y-auto flex-shrink-0">
        <DesktopDrawer />
      </aside>
      {/* Mobile menu button */}
      <button
        className="block md:hidden fixed top-4 left-4 z-50 bg-white/80 rounded-full p-2 shadow"
        onClick={() => setMobileDrawerOpen(true)}
        aria-label="Mở menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Drawer overlay */}
      {mobileDrawerOpen && (
        <DesktopDrawer isMobileDrawer onClose={() => setMobileDrawerOpen(false)} />
      )}
      {/* Main content */}
      <main className="flex-1 h-full min-h-0 overflow-y-auto px-6 py-2 text-base">
        <div className="max-w-5x h-full min-h-0 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
