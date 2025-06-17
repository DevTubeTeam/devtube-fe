import { cn } from '@/utils';
import { BookOpen, ChevronDown, ChevronUp, Flame, HelpCircle, History, Home, ListVideo, PlaySquare, Settings, Star, ThumbsUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const INITIAL_SHOW_COUNT = 10;

const subscriptions = [
  { key: 'faptv', label: 'FAPTV', avatar: '/avatars/faptv.png', live: true },
  { key: 'gino', label: 'GINÕ TỐNG', avatar: '/avatars/gino.png', live: false },
  { key: 'jtbc', label: 'JTBC Drama', avatar: '/avatars/jtbc.png', live: true },
  { key: 'rip113', label: 'Rip113', avatar: '/avatars/rip113.png', live: false },
  { key: 'wwe', label: 'WWE', avatar: '/avatars/wwe.png', live: false },
  { key: '1million', label: '1MILLION Dance...', avatar: '/avatars/1million.png', live: false },
  { key: '3gg', label: '3GG_P4C', avatar: '/avatars/3gg.png', live: false },
  { key: 'vpop', label: 'V-POP Official', avatar: '/avatars/vpop.png', live: false },
  { key: 'mixigaming', label: 'MixiGaming', avatar: '/avatars/mixi.png', live: true },
  { key: 'sontung', label: 'Sơn Tùng M-TP', avatar: '/avatars/sontung.png', live: false },
  { key: 'pewdiepie', label: 'PewDiePie', avatar: '/avatars/pewdiepie.png', live: false },
  { key: 'mrbeast', label: 'MrBeast', avatar: '/avatars/mrbeast.png', live: true },
  { key: 'jsmastery', label: 'JS Mastery', avatar: '/avatars/jsmastery.png', live: false },
  { key: 'freecodecamp', label: 'freeCodeCamp', avatar: '/avatars/fcc.png', live: false },
  { key: 'ted', label: 'TED', avatar: '/avatars/ted.png', live: false },
  { key: 'theanh28', label: 'Thế Anh 28', avatar: '/avatars/theanh28.png', live: false },
  { key: 'vtv24', label: 'VTV24', avatar: '/avatars/vtv24.png', live: false },
  { key: 'kenh14', label: 'Kenh14', avatar: '/avatars/kenh14.png', live: false },
  { key: 'zingnews', label: 'Zing News', avatar: '/avatars/zingnews.png', live: false },
  { key: 'dantri', label: 'Dân Trí', avatar: '/avatars/dantri.png', live: false },
  { key: 'cafebiz', label: 'CafeBiz', avatar: '/avatars/cafebiz.png', live: false },
  { key: 'vietnamnet', label: 'Vietnamnet', avatar: '/avatars/vietnamnet.png', live: false },
  { key: 'vtv7', label: 'VTV7', avatar: '/avatars/vtv7.png', live: false },
  { key: 'vcl', label: 'VCL Channel', avatar: '/avatars/vcl.png', live: false },
];

type MenuItemType = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const DesktopDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [showAllSubscriptions, setShowAllSubscriptions] = useState(false);

  const primaryNavItems: MenuItemType[] = [
    { key: 'home', icon: <Home size={18} />, label: 'Trang chủ', path: '/' },
    { key: 'shorts', icon: <Flame size={18} />, label: 'Shorts', path: '/shorts' },
    { key: 'subscriptions', icon: <PlaySquare size={18} />, label: 'Kênh đăng ký', path: '/subscriptions' },
  ];

  const libraryItems: MenuItemType[] = [
    { key: 'history', icon: <History size={18} />, label: 'Video đã xem', path: '/history' },
    { key: 'bookmarks', icon: <BookOpen size={18} />, label: 'Danh sách phát', path: '/bookmarks' },
    { key: 'your-videos', icon: <Users size={18} />, label: 'Video của bạn', path: '/your-videos' },
    { key: 'watch-later', icon: <Star size={18} />, label: 'Xem sau', path: '/watch-later' },
    { key: 'liked', icon: <ThumbsUp size={18} />, label: 'Video đã thích', path: '/liked' },
  ];

  const footerItems: MenuItemType[] = [
    { key: 'settings', icon: <Settings size={18} />, label: 'Cài đặt', path: '/settings' },
    { key: 'help', icon: <HelpCircle size={18} />, label: 'Trợ giúp', path: '/help' },
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

  const visibleSubscriptions = showAllSubscriptions
    ? subscriptions
    : subscriptions.slice(0, INITIAL_SHOW_COUNT);

  const hasMoreSubscriptions = subscriptions.length > INITIAL_SHOW_COUNT;

  return (
    <div className="h-screen flex flex-col bg-background border-r border-border w-64">
      {/* Scroll area cho toàn bộ sidebar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
        {/* Section: Chính */}
        <div className="mb-2 space-y-1">
          {primaryNavItems.map(renderMenuItem)}
        </div>
        <div className="border-t border-border my-2" />

        {/* Section: Bạn */}
        <div className="mb-2">
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">Bạn</h3>
          <div className="space-y-1">{libraryItems.map(renderMenuItem)}</div>
        </div>
        <div className="border-t border-border my-2" />

        {/* Section: Kênh đăng ký */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">Kênh đăng ký</h3>
          <div className="space-y-1">
            {visibleSubscriptions.map(sub => (
              <div key={sub.key} className="flex items-center px-3 py-1 rounded-md hover:bg-accent/50 cursor-pointer">
                <img src={sub.avatar} alt={sub.label} className="w-6 h-6 rounded-full mr-3" />
                <span className="flex-1 truncate">{sub.label}</span>
                {sub.live && <span className="text-xs text-red-500 ml-2">●</span>}
              </div>
            ))}
            {showAllSubscriptions && (
              <button
                onClick={() => navigate('/channels')}
                className="flex items-center w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 hover:text-foreground rounded-md transition-colors text-muted-foreground"
              >
                <ListVideo className="w-4 h-4 mr-3" />
                Tất cả các kênh đăng ký
              </button>
            )}
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
                    Hiện thêm {subscriptions.length - INITIAL_SHOW_COUNT} kênh
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-border my-2" />

        {/* Section: Cài đặt */}
        <div className="space-y-1">
          {footerItems.map(renderMenuItem)}
        </div>
      </div>
    </div>
  );
};

export default DesktopDrawer;
