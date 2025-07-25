"use client";

import {
  LayoutDashboard,
  ImageIcon,
  Menu,
  Megaphone,
  Monitor,
  ShoppingBag,
  Star,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";
import { useState } from "react";
import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

const primaryNav = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/products", icon: ShoppingBag },
  { label: "Media", path: "/media", icon: ImageIcon },
];

const moreNav = [
  { label: "Banner Maker", path: "/banners", icon: Megaphone },
  { label: "Customer Reviews", path: "/reviews", icon: Star },
  { label: "Site Preview", path: "/preview", icon: Monitor },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Main Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-primary flex justify-around py-2 sm:hidden">
        {primaryNav.map(({ label, path, icon: Icon }) => {
          const isActive = pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className="flex flex-col items-center justify-center text-xs"
            >
              <Icon
                className={clsx(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={clsx(
                  "text-[11px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Sheet Trigger for More */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center justify-center text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">More</span>
            </button>
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent
            side="bottom"
            className="rounded-t-2xl max-h-[80vh] overflow-y-auto border-t border-primary"
          >
            <div className="px-4 py-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                More Options
              </p>

              <div className="grid grid-cols-3 gap-4">
                {moreNav.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={label}
                    href={path}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-2 text-center rounded-md hover:bg-muted transition"
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-muted-foreground/10 text-foreground mb-1"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-xs">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Utility Zone: Theme + Account */}
              <div className="pt-4 border-t border-primary flex items-center justify-between">
                <ThemeToggle />

                <SignedIn>
                  <div className="flex items-center gap-2">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            "w-8 h-8 ring-1 ring-border rounded-full",
                          userButtonPopoverActionButton:
                            "text-foreground hover:bg-muted/20",
                        },
                      }}
                    />
                    {/* <SignOutButton /> */}
                    <SignOutButton>
                      <button
                        className="p-2 rounded-md hover:bg-muted transition text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()} // Prevent Sheet auto-close
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </SignOutButton>
                  </div>
                </SignedIn>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
};
