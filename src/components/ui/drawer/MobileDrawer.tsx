import Logo from '@/components/shared/Navbar/Logo';
import { Divider, Drawer, Menu } from 'antd';
import {
  BookOpen,
  Flame,
  HelpCircle,
  History,
  Home,
  PlaySquare,
  Settings,
  Star,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type MenuItemType = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const primaryNavItems: MenuItemType[] = [
    { key: 'home', icon: <Home size={16} />, label: 'Home', path: '/' },
    {
      key: 'trending',
      icon: <Flame size={16} />,
      label: 'Trending',
      path: '/trending',
    },
    {
      key: 'subscriptions',
      icon: <PlaySquare size={16} />,
      label: 'Subscriptions',
      path: '/subscriptions',
    },
  ];

  const libraryItems: MenuItemType[] = [
    {
      key: 'history',
      icon: <History size={16} />,
      label: 'History',
      path: '/history',
    },
    {
      key: 'bookmarks',
      icon: <BookOpen size={16} />,
      label: 'Bookmarks',
      path: '/bookmarks',
    },
    {
      key: 'liked',
      icon: <ThumbsUp size={16} />,
      label: 'Liked Videos',
      path: '/liked',
    },
  ];

  const exploreItems: MenuItemType[] = [
    {
      key: 'popular',
      icon: <Star size={16} />,
      label: 'Popular Topics',
      path: '/popular',
    },
    {
      key: 'community',
      icon: <Users size={16} />,
      label: 'Community',
      path: '/community',
    },
  ];

  const footerItems: MenuItemType[] = [
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'Settings',
      path: '/settings',
    },
    {
      key: 'help',
      icon: <HelpCircle size={16} />,
      label: 'Help',
      path: '/help',
    },
  ];

  const renderMenuItems = (items: MenuItemType[]) => {
    return items.map(item => (
      <Menu.Item
        key={item.key}
        icon={item.icon}
        className={`text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
          currentPath === item.path ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
        onClick={onClose}
      >
        <Link to={item.path}>
          <span className="ml-2">{item.label}</span>
        </Link>
      </Menu.Item>
    ));
  };

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      open={open}
      closeIcon={null}
      width="85%"
    >
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        {/* Header with Logo and Close button */}
        <div className="p-3 flex items-center justify-between border-b">
          <Logo className="h-6 w-auto" />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[
            primaryNavItems.find(item => item.path === currentPath)?.key || '',
          ]}
          className="border-0"
        >
          {renderMenuItems(primaryNavItems)}
        </Menu>

        <Divider className="my-0.5" />

        {/* Library Section */}
        <div className="px-4 py-1.5">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Library
          </h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[
            libraryItems.find(item => item.path === currentPath)?.key || '',
          ]}
          className="border-0"
        >
          {renderMenuItems(libraryItems)}
        </Menu>

        <Divider className="my-0.5" />

        {/* Explore Section */}
        <div className="px-4 py-1.5">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Explore
          </h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[
            exploreItems.find(item => item.path === currentPath)?.key || '',
          ]}
          className="border-0"
        >
          {renderMenuItems(exploreItems)}
        </Menu>

        <div className="flex-grow"></div>

        {/* Footer Items */}
        <Divider className="my-0.5" />
        <Menu
          mode="inline"
          selectedKeys={[
            footerItems.find(item => item.path === currentPath)?.key || '',
          ]}
          className="border-0"
        >
          {renderMenuItems(footerItems)}
        </Menu>

        {/* Copyright */}
        <div className="p-3 text-xs text-gray-500 dark:text-gray-400">
          © 2023 DevTube
        </div>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;
