import UserMenu from '@/components/shared/Navbar/UserMenu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Bookmark,
  ChevronLeft,
  Film,
  Layers,
  ListVideo,
  Menu,
  Settings,
  User,
  Video
} from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Main navigation items (phần trên)
  const mainNavigationItems = [
    {
      name: 'Tổng quan',
      path: '/dashboard',
      icon: <Video className="h-5 w-5" />,
      description: 'Trang tổng quan kênh',
    },
    {
      name: 'Video của tôi',
      path: '/dashboard/videos',
      icon: <Film className="h-5 w-5" />,
      description: 'Quản lý video đã đăng',
    },
    {
      name: 'Danh sách phát',
      path: '/dashboard/playlists',
      icon: <Layers className="h-5 w-5" />,
      description: 'Quản lý playlist',
    },
    {
      name: 'Đã lưu',
      path: '/dashboard/saved',
      icon: <Bookmark className="h-5 w-5" />,
      description: 'Quản lý video đã lưu',
    },
    {
      name: 'Trang cá nhân',
      path: '/dashboard/profile',
      icon: <User className="h-5 w-5" />,
      description: 'Trang cá nhân',
    },
    {
      name: 'Cài đặt',
      path: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      description: 'Cài đặt tài khoản',
    },
  ];

  // Footer navigation items (phần dưới)
  const footerNavigationItems = [
    {
      name: 'Cài đặt',
      path: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      description: 'Cài đặt tài khoản',
    },
  ];

  // Tiêu đề động theo route
  const getTitle = () => {
    if (location.pathname === '/dashboard') return 'Tổng quan';
    if (location.pathname.startsWith('/dashboard/videos')) return 'Video của tôi';
    if (location.pathname.startsWith('/dashboard/playlists')) return 'Playlist';
    if (location.pathname.startsWith('/dashboard/settings')) return 'Cài đặt';
    return 'Bảng điều khiển';
  };

  // Xử lý active item
  const isActive = (itemPath: string) => {
    if (itemPath === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(itemPath);
  };

  // Xử lý click nút tải video mới
  const handleOpenUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/dashboard/videos?openUpload=true');
  };

  return (
    <div className={`flex min-h-screen}`}>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} border-r shadow-sm flex flex-col bg-white dark:bg-neutral-900`}
      >
        {/* Sidebar Header */}
        <div className={`flex h-16 items-center justify-between border-b-0 px-4`}>
          {!isCollapsed && (
            <span className={`text-xl font-bold tracking-tight`}>DevHub Studio</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800`}
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
              className={`flex items-center rounded-md px-3 py-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${isActive(item.path) ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              title={isCollapsed ? item.description : undefined}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
          {/* Nút tạo mới */}
          {!isCollapsed && (
            <button
              onClick={handleOpenUpload}
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors px-3 py-2.5 w-full"
            >
              <ListVideo className="h-5 w-5" />
              <span className="font-medium">Tải video mới</span>
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={handleOpenUpload}
              className="mt-4 flex items-center justify-center rounded-md bg-neutral-900 text-white hover:bg-neutral-800 w-full"
              title="Tải video mới"
            >
              <ListVideo className="h-5 w-5" />
            </button>
          )}
        </nav>

        {/* Footer Navigation */}
        <div className={`mt-auto border-t p-2`}>
          {footerNavigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${isActive(item.path) ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              title={isCollapsed ? item.description : undefined}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 bg-neutral-50 dark:bg-neutral-950`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 shadow-sm bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Nút về trang chủ */}
            <Link
              to="/"
              className="rounded px-3 py-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Về trang chủ"
            >
              Trang chủ
            </Link>

            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative">
                  <Bell size={20} />
                  {/* Badge số lượng nếu có */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-2 font-semibold border-b">Thông báo</div>
                <ScrollArea className="max-h-72">
                  {/* Danh sách thông báo mock/demo */}
                  {[...Array(10)].map((_, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 py-3 px-4 border-b last:border-b-0">
                      <div className="font-medium">Thông báo {i + 1}</div>
                      <div className="text-xs text-muted-foreground">Vừa xong</div>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Icon - vào profile */}
            <Link to={ROUTES.DASHBOARD_PROFILE} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <User size={20} />
            </Link>

            {/* Logout */}
            <UserMenu /> {/* Hoặc custom nút logout riêng nếu muốn */}
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
