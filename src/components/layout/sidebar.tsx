'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { LayoutDashboard, Package, FolderTree, User, ShoppingBag } from 'lucide-react';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: LayoutDashboard },
//   { name: 'Categories', href: '/categories', icon: FolderTree },
//   { name: 'Products', href: '/products', icon: Package },
//   { name: 'Profile', href: '/profile', icon: User },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <div className="flex h-full w-64 flex-col bg-card border-r">
//       <div className="flex h-16 items-center border-b px-6">
//         <div className="flex items-center gap-2">
//           <ShoppingBag className="h-6 w-6 text-primary" />
//           <span className="text-lg font-semibold">E-Commerce</span>
//         </div>
//       </div>
//       <ScrollArea className="flex-1">
//         <nav className="flex flex-col gap-1 p-4">
//           {navigation.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link key={item.name} href={item.href}>
//                 <Button
//                   variant={isActive ? 'secondary' : 'ghost'}
//                   className={cn(
//                     'w-full justify-start gap-2',
//                     isActive && 'bg-secondary'
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   {item.name}
//                 </Button>
//               </Link>
//             );
//           })}
//         </nav>
//       </ScrollArea>
//     </div>
//   );
// }

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
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import { SignedIn, useClerk, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
//   { label: 'Categories', icon: FolderKanban, path: '/categories' },
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
                'group relative flex items-center  gap-3 p-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/10 text-foreground' ,
                  expanded ? 'justify-start' : 'justify-center'
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
     <div className="mt-auto px-4 py-4 border-t border-primary/40 text-foreground">
  <SignedIn>
    <div className={clsx(
      "w-full",
      expanded ? "flex items-center justify-between gap-4" : "flex flex-col items-center gap-3"
    )}>
      {/* User */}
      <div className={clsx("flex items-center", expanded ? "gap-3" : "flex-col")}>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9 ring-1 ring-border",
              userButtonPopoverActionButton: "text-foreground hover:bg-muted/20",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
        {expanded && user && (
          <div className="leading-tight">
            <p className="text-sm font-medium">{user.username}</p>
          </div>
        )}
      </div>

      {/* Theme + Collapse Toggle */}
      <div className={clsx(
        "flex items-center",
        expanded ? "gap-2" : "flex-col gap-3 mt-2"
      )}>
        <ThemeToggle />
        <button
          onClick={toggle}
          className="hover:bg-muted/10 p-2 rounded-md text-muted-foreground transition"
          title={expanded ? "Collapse Sidebar (⌘+B)" : "Expand Sidebar (⌘+B)"}
        >
          {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </SignedIn>
</div>





    </aside>
  );
};

export default Sidebar;