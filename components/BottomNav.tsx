"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar, Bookmark, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Browse", href: "/browse", icon: Compass },
    { label: "Schedule", href: "#schedule", icon: Calendar },
    { label: "Library", href: "#library", icon: Bookmark },
    { label: "Profile", href: "#profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 glass-panel border-t border-white/[0.08] backdrop-blur-xl bg-midnight/90 px-3 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : Boolean(pathname?.startsWith(item.href)) && item.href !== "/";

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-14 py-1 transition-all ${
              isActive ? "text-electric-purple" : "text-soft-gray hover:text-white"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 transition-transform active:scale-90" />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-neon-pink shadow-glow-pink animate-pulse" />
              )}
            </div>
            <span className="text-[11px] font-medium font-inter tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
