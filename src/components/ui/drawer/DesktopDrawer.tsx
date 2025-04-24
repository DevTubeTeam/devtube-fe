import { cn } from '@/utils';
import { BookOpen, Flame, HelpCircle, History, Home, PlaySquare, Settings, Star, ThumbsUp, Users } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type MenuItemType = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const DesktopDrawer: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const primaryNavItems: MenuItemType[] = [
    { key: 'home', icon: <Home size={18} />, label: 'Home', path: '/' },
    { key: 'trending', icon: <Flame size={18} />, label: 'Trending', path: '/trending' },
    { key: 'subscriptions', icon: <PlaySquare size={18} />, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const libraryItems: MenuItemType[] = [
    { key: 'history', icon: <History size={18} />, label: 'History', path: '/history' },
    { key: 'bookmarks', icon: <BookOpen size={18} />, label: 'Bookmarks', path: '/bookmarks' },
    { key: 'liked', icon: <ThumbsUp size={18} />, label: 'Liked Videos', path: '/liked' },
  ];

  const exploreItems: MenuItemType[] = [
    { key: 'popular', icon: <Star size={18} />, label: 'Popular Topics', path: '/popular' },
    { key: 'community', icon: <Users size={18} />, label: 'Community', path: '/community' },
  ];

  const footerItems: MenuItemType[] = [
    { key: 'settings', icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
    { key: 'help', icon: <HelpCircle size={18} />, label: 'Help', path: '/help' },
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

  const renderSection = (title: string, items: MenuItemType[]) => (
    <div className="mb-6">
      {title && (
        <h3 className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
      )}
      <div className="space-y-1">{items.map(renderMenuItem)}</div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background border-r border-border w-64">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
        {renderSection('', primaryNavItems)}
        {renderSection('Library', libraryItems)}
        {renderSection('Explore', exploreItems)}
        {renderSection('', footerItems)}
      </div>

      <div className="p-4 text-xs text-muted-foreground border-t border-border">
        © 2025 DevTube. All rights reserved.
      </div>
    </div>
  );
};

export default DesktopDrawer;
