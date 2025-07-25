'use client';

import React, { useEffect, useState } from 'react';

import { BottomNav } from '@/components/BottomNav';
import Sidebar from '@/components/layout/sidebar';



// const BottomNav = () => {
//   const pathname = usePathname();
//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
//     // { label: 'Categories', path: '/categories', icon: FolderKanban },
//     { label: 'Products', path: '/products', icon: ShoppingBag },
//     { label: 'Media', path: '/media', icon: ImageIcon },
//     { label: 'More', path: '/more', icon: Menu },
//   ];

//   return (
//     <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border flex justify-around py-2 sm:hidden">
//       {navItems.map(({ label, path, icon: Icon }) => {
//         const isActive = pathname.startsWith(path);
//         return (
//           <Link
//             key={path}
//             href={path}
//             className="flex flex-col items-center justify-center text-xs"
//           >
//             <Icon
//               className={clsx(
//                 'w-5 h-5',
//                 isActive ? 'text-primary' : 'text-muted-foreground'
//               )}
//             />
//             <span
//               className={clsx(
//                 'text-[11px]',
//                 isActive ? 'text-primary' : 'text-muted-foreground'
//               )}
//             >
//               {label}
//             </span>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// };

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
