import { useAuth } from '@/contexts';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils';
import {
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Home,
  ListVideo,
  Loader2,
  PlaySquare,
  Search,
  Star,
  ThumbsUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const INITIAL_SHOW_COUNT = 10;

// Mock data cho fallback khi chưa có dữ liệu thực
const fallbackSubscriptions = [
  { key: 'faptv', label: 'FAPTV', avatar: '/avatars/faptv.png', live: true },
  { key: 'gino', label: 'GINÕ TỐNG', avatar: '/avatars/gino.png', live: false },
  { key: 'jtbc', label: 'JTBC Drama', avatar: '/avatars/jtbc.png', live: true },
  { key: 'rip113', label: 'Rip113', avatar: '/avatars/rip113.png', live: false },
  { key: 'wwe', label: 'WWE', avatar: '/avatars/wwe.png', live: false },
];

type MenuItemType = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const DesktopDrawer: React.FC<{ isMobileDrawer?: boolean; onClose?: () => void }> = ({ isMobileDrawer, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);
  const { isAuthenticated } = useAuth();

  // Lấy danh sách channel đã subscribe
  const { useGetSubscribedChannels } = useUser();
  const {
    data: subscribedChannelsData,
    isLoading: isSubscribedChannelsLoading,
    error: subscribedChannelsError,
  } = useGetSubscribedChannels();

  const primaryNavItems: MenuItemType[] = [
    { key: 'home', icon: <Home size={18} />, label: 'Trang chủ', path: '/' },
    { key: 'subscriptions', icon: <PlaySquare size={18} />, label: 'Kênh đăng ký', path: ROUTES.CHANNELS },
    { key: 'explore', icon: <Search size={18} />, label: 'Khám phá', path: ROUTES.EXPLORE },
  ];

  const libraryItems: MenuItemType[] = [
    { key: 'playlists', icon: <BookOpen size={18} />, label: 'Danh sách phát', path: ROUTES.PLAYLISTS },
    { key: 'your-videos', icon: <Users size={18} />, label: 'Video của bạn', path: ROUTES.DASHBOARD_VIDEOS },
    { key: 'watch-later', icon: <Star size={18} />, label: 'Xem sau', path: ROUTES.WATCH_LATER },
    { key: 'liked', icon: <ThumbsUp size={18} />, label: 'Video đã thích', path: ROUTES.LIKED },
    { key: 'saved', icon: <Bookmark size={18} />, label: 'Video đã lưu', path: ROUTES.SAVED },
  ];

  const renderMenuItem = (item: MenuItemType) => {
    const isActive = currentPath === item.path;
    return (
      <Link
        key={item.key}
        to={item.path}
        className={cn(
          'flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
        )}
      >
        <span className="mr-3">{item.icon}</span>
        {item.label}
      </Link>
    );
  };

  // Xử lý dữ liệu channel đã subscribe
  const subscribedChannels = subscribedChannelsData?.data?.channels || [];
  const totalSubscribedCount = subscribedChannelsData?.data?.totalCount || 0;

  // Sử dụng dữ liệu thực nếu có, nếu không dùng fallback
  const displayChannels = subscribedChannels.length > 0 ? subscribedChannels : fallbackSubscriptions;

  const visibleSubscriptions = showAllSubscriptions ? displayChannels : displayChannels.slice(0, INITIAL_SHOW_COUNT);

  const hasMoreSubscriptions = displayChannels.length > INITIAL_SHOW_COUNT;

  // Render subscription item
  const renderSubscriptionItem = (channel: any, index: number) => {
    // Nếu là dữ liệu thực từ API
    if (subscribedChannels.length > 0) {
      return (
        <Link
          key={channel.id}
          to={`/channel/${channel.id}`}
          className="flex items-center px-3 py-1 rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
        >
          <img
            src={channel.thumbnailUrl || 'https://cdn-icons-png.flaticon.com/512/1179/1179069.png'}
            alt={channel.name}
            className="w-6 h-6 rounded-full mr-3 object-cover"
          />
          <span className="flex-1 truncate text-sm">{channel.name}</span>
        </Link>
      );
    }

    // Nếu là fallback data
    return (
      <div key={channel.key} className="flex items-center px-3 py-1 rounded-md hover:bg-accent/50 cursor-pointer">
        <img src={channel.avatar} alt={channel.label} className="w-6 h-6 rounded-full mr-3" />
        <span className="flex-1 truncate text-sm">{channel.label}</span>
        {channel.live && <span className="text-xs text-red-500 ml-2">●</span>}
      </div>
    );
  };

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex">
        <div className="bg-background w-64 h-full flex flex-col shadow-lg animate-slide-in-left">
          <button
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-accent"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          {/* Section: Chính */}
          <div className="mb-2 space-y-1">{primaryNavItems.map(renderMenuItem)}</div>
          <div className="border-t border-border my-2" />

          {/* Section: Bạn */}
          <div className="mb-2">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">Bạn</h3>
            <div className="space-y-1">{libraryItems.map(renderMenuItem)}</div>
          </div>
          <div className="border-t border-border my-2" />

          {/* Section: Kênh đăng ký */}
          <div>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">
              Kênh đăng ký
              {totalSubscribedCount > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">({totalSubscribedCount})</span>
              )}
            </h3>
            <div className="space-y-1">
              {!isAuthenticated ? (
                <div className="px-3 py-2">
                  <span className="text-sm text-muted-foreground">Bạn chưa đăng nhập</span>
                </div>
              ) : isSubscribedChannelsLoading ? (
                // Loading state
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Đang tải...</span>
                  </div>
                </div>
              ) : subscribedChannelsError ? (
                // Error state
                <div className="px-3 py-2">
                  <span className="text-sm text-red-500">Lỗi tải kênh đăng ký</span>
                </div>
              ) : subscribedChannels.length === 0 ? (
                // Empty state
                <div className="px-3 py-2">
                  <span className="text-sm text-muted-foreground">Chưa đăng ký kênh nào</span>
                </div>
              ) : (
                // Render subscribed channels
                visibleSubscriptions.map(renderSubscriptionItem)
              )}

              {/* Show all subscriptions button */}
              {subscribedChannels.length > 0 && showAllSubscriptions && (
                <button
                  onClick={() => navigate('/channels')}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 hover:text-foreground rounded-md transition-colors text-muted-foreground"
                >
                  <ListVideo className="w-4 h-4 mr-3" />
                  Tất cả các kênh đăng ký
                </button>
              )}

              {/* Show more/less button */}
              {hasMoreSubscriptions && (
                <button
                  onClick={() => setShowAllSubscriptions(!showAllSubscriptions)}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md transition-colors"
                >
                  {showAllSubscriptions ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-3" />
                      Thu gọn
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-3" />
                      Hiện thêm {displayChannels.length - INITIAL_SHOW_COUNT} kênh
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Click outside để đóng */}
        <div className="flex-1" onClick={onClose} />
      </div>
    );
  }

  // Sidebar desktop
  return (
    <div className="hidden md:flex h-screen flex-col bg-background border-r border-border w-64">
      {/* Scroll area cho toàn bộ sidebar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
        {/* Section: Chính */}
        <div className="mb-2 space-y-1">{primaryNavItems.map(renderMenuItem)}</div>
        <div className="border-t border-border my-2" />

        {/* Section: Bạn */}
        <div className="mb-2">
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">Bạn</h3>
          <div className="space-y-1">{libraryItems.map(renderMenuItem)}</div>
        </div>
        <div className="border-t border-border my-2" />

        {/* Section: Kênh đăng ký */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">
            Kênh đăng ký
            {totalSubscribedCount > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">({totalSubscribedCount})</span>
            )}
          </h3>
          <div className="space-y-1">
            {!isAuthenticated ? (
              <div className="px-3 py-2">
                <span className="text-sm text-muted-foreground">Bạn chưa đăng nhập</span>
              </div>
            ) : isSubscribedChannelsLoading ? (
              // Loading state
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Đang tải...</span>
                </div>
              </div>
            ) : subscribedChannelsError ? (
              // Error state
              <div className="px-3 py-2">
                <span className="text-sm text-red-500">Lỗi tải kênh đăng ký</span>
              </div>
            ) : subscribedChannels.length === 0 ? (
              // Empty state
              <div className="px-3 py-2">
                <span className="text-sm text-muted-foreground">Chưa đăng ký kênh nào</span>
              </div>
            ) : (
              // Render subscribed channels
              visibleSubscriptions.map(renderSubscriptionItem)
            )}

            {/* Show all subscriptions button */}
            {subscribedChannels.length > 0 && showAllSubscriptions && (
              <button
                onClick={() => navigate('/channels')}
                className="flex items-center w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 hover:text-foreground rounded-md transition-colors text-muted-foreground"
              >
                <ListVideo className="w-4 h-4 mr-3" />
                Tất cả các kênh đăng ký
              </button>
            )}

            {/* Show more/less button */}
            {hasMoreSubscriptions && (
              <button
                onClick={() => setShowAllSubscriptions(!showAllSubscriptions)}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md transition-colors"
              >
                {showAllSubscriptions ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-3" />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-3" />
                    Hiện thêm {displayChannels.length - INITIAL_SHOW_COUNT} kênh
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopDrawer;
