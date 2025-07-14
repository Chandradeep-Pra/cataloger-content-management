'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ImageIcon,
  Megaphone,
  Monitor,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import { SignedIn, useClerk, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Categories', icon: FolderKanban, path: '/categories' },
  { label: 'Products', icon: ShoppingBag, path: '/products' },
  { label: 'Media Library', icon: ImageIcon, path: '/media' },
  { label: 'Banner Maker', icon: Megaphone, path: '/banners' },
  { label: 'Customer Reviews', icon: Star, path: '/reviews' },
  { label: 'Site Preview', icon: Monitor, path: '/preview' },
];

const Sidebar = ({
  expanded,
  toggle,
}: {
  expanded: boolean;
  toggle: () => void;
}) => {
  const pathname = usePathname();
  const { user } = useClerk();

  return (
    <aside
      className={clsx(
        'hidden sm:flex h-full shrink-0 border-r-2 border-primary bg-transparent flex-col transition-all duration-300',
        expanded ? 'w-56' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between p-4 font-bold text-lg text-foreground">
        {expanded ? 'Catalog CMS' : '🧩'}
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map(({ label, icon: Icon, path }) => {
          const isActive = pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={clsx(
                'group relative flex items-center gap-3 p-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/10 text-foreground'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
              {expanded && <span className="truncate">{label}</span>}
              {!expanded && (
                <span className="absolute left-full ml-2 z-10 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-border px-4 py-4 text-foreground space-y-4">
        <SignedIn>
          <div className={clsx("flex items-center", expanded ? "justify-between" : "flex-col gap-3")}>
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 ring-1 ring-border rounded-full",
                    userButtonPopoverActionButton: "text-foreground hover:bg-muted/20",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
              {expanded && user && (
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{user.username}</p>
                </div>
              )}
            </div>
          </div>
        </SignedIn>

        <button
          onClick={toggle}
          className={clsx(
            "w-full flex items-center justify-center p-2 rounded-md transition hover:bg-muted/10 text-muted-foreground",
            expanded ? "justify-start" : "justify-center"
          )}
          title={expanded ? "Collapse Sidebar (⌘+B)" : "Expand Sidebar (⌘+B)"}
        >
          {expanded ? (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};

const BottomNav = () => {
  const pathname = usePathname();
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Categories', path: '/categories', icon: FolderKanban },
    { label: 'Products', path: '/products', icon: ShoppingBag },
    { label: 'Media', path: '/media', icon: ImageIcon },
    { label: 'More', path: '/more', icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border flex justify-around py-2 sm:hidden">
      {navItems.map(({ label, path, icon: Icon }) => {
        const isActive = pathname.startsWith(path);
        return (
          <Link
            key={path}
            href={path}
            className="flex flex-col items-center justify-center text-xs"
          >
            <Icon
              className={clsx(
                'w-5 h-5',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={clsx(
                'text-[11px]',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar expanded={expanded} toggle={toggleSidebar} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default DashLayout;
