import { ModeToggle } from '@/components/common/ModeToggle';
import {
  BarChart,
  Bell,
  ChevronLeft,
  Film,
  Flag,
  Home,
  ListVideo,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Main navigation items (phần trên)
  const mainNavigationItems = [
    {
      name: 'Tổng quan',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      description: 'Tổng quan về kênh của bạn',
    },
    {
      name: 'Nội dung',
      path: '/dashboard/content',
      icon: <Film className="h-5 w-5" />,
      description: 'Quản lý các video, shorts và playlist',
    },
    {
      name: 'Số liệu phân tích',
      path: '/dashboard/analytics',
      icon: <BarChart className="h-5 w-5" />,
      description: 'Số liệu về người xem, lượt xem và thu nhập',
    },
    {
      name: 'Cộng đồng',
      path: '/dashboard/community',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Bình luận và lượt đề cập',
    },
  ];

  // Footer navigation items (phần dưới)
  const footerNavigationItems = [
    {
      name: 'Cài đặt',
      path: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      description: 'Cài đặt kênh và tùy chỉnh',
    },
    {
      name: 'Gửi ý kiến phản hồi',
      path: '/dashboard/feedback',
      icon: <Flag className="h-5 w-5" />,
      description: 'Gửi ý kiến phản hồi cho đội ngũ phát triển',
    },
  ];

  return (
    <div className={`flex min-h-screen}`}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'
          } border-r shadow-sm flex flex-col`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex h-16 items-center justify-between border-b-0 px-4`}
        >
          {!isCollapsed && (
            <span className={`text-xl font-bold `}>DevHub Studio</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`rounded p-1 `}
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1 p-2 flex-grow">
          {mainNavigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2.5 transition-colors`}
              title={isCollapsed ? item.description : undefined}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}

          {/* Create content button */}
          {!isCollapsed && (
            <Link
              to="/dashboard/content/upload"
              className="mt-4 flex items-center justify-center gap-2 rounded-mdpx-3 py-2.5 "
            >
              <ListVideo className="h-5 w-5" />
              <span className="font-medium">Tạo mới</span>
            </Link>
          )}
          {isCollapsed && (
            <Link
              to="/dashboard/content/upload"
              className="mt-4 flex items-center justify-center rounded-md"
              title="Tạo mới"
            >
              <ListVideo className="h-5 w-5" />
            </Link>
          )}
        </nav>

        {/* Footer Navigation */}
        <div className={`mt-auto border-t  p-2`}>
          {footerNavigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2.5 transition-colors`}
              title={isCollapsed ? item.description : undefined}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              {location.pathname === '/dashboard'
                ? 'Tổng quan'
                : location.pathname.includes('/content')
                  ? 'Nội dung'
                  : location.pathname.includes('/analytics')
                    ? 'Số liệu phân tích'
                    : location.pathname.includes('/community')
                      ? 'Cộng đồng'
                      : location.pathname.includes('/settings')
                        ? 'Cài đặt'
                        : location.pathname.includes('/feedback')
                          ? 'Gửi ý kiến phản hồi'
                          : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <button className="rounded-full p-2 hover:bg-gray-100">
              <Bell size={20} />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <User size={20} />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
