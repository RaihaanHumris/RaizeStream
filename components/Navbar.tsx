"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Globe, User, Menu, X, Bell } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Genres", href: "/browse?genre=Action" },
    { name: "Schedule", href: "#schedule" },
    { name: "Trending", href: "#trending" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] glass-panel transition-all">
      <div className="max-w-[1440px] h-full mx-auto px-4 md:px-12 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-md bg-gradient-brand flex items-center justify-center shadow-glow-purple transition-transform group-hover:scale-105">
            <span className="font-outfit font-extrabold text-white text-2xl tracking-tighter">
              R
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-bold text-xl tracking-tight text-white group-hover:text-electric-purple transition-colors">
              Raize<span className="text-neon-pink">Stream</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : Boolean(pathname?.startsWith(link.href.split("?")[0])) && link.href !== "/";

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-poppins text-[15px] font-medium transition-colors hover:text-white py-1 ${
                  isActive ? "text-white" : "text-soft-gray"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-purple rounded-full shadow-glow-purple" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Language, Profile */}
        <div className="flex items-center gap-3">
          {/* Search Bar Desktop */}
          <div className="relative hidden md:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-52 xl:w-64 h-10 pl-10 pr-4 rounded-full bg-slate-night/80 border border-outline text-sm text-white placeholder-muted focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-soft-gray absolute left-3.5 pointer-events-none" />
          </div>

          {/* Language Toggle */}
          <button
            aria-label="Toggle language"
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-white hover:border-electric-purple transition-colors"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="hidden sm:flex relative w-10 h-10 rounded-full glass-panel items-center justify-center text-soft-gray hover:text-white hover:border-electric-purple transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-pink shadow-glow-pink"></span>
          </button>

          {/* Profile / Login */}
          <Link
            href="/browse"
            className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full glass-panel border border-outline hover:border-electric-purple transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-electric-purple/20 border border-electric-purple/40 flex items-center justify-center text-electric-purple group-hover:scale-105 transition-transform">
              <User className="w-4 h-4 text-electric-purple" />
            </div>
            <span className="hidden sm:inline font-poppins text-xs font-semibold text-soft-gray group-hover:text-white">
              Sign In
            </span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dropdown border-b border-outline px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-night border border-outline text-sm text-white placeholder-muted focus:outline-none focus:border-electric-purple"
            />
            <Search className="w-4 h-4 text-soft-gray absolute left-3.5 top-3 pointer-events-none" />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-md text-soft-gray hover:text-white hover:bg-slate-night font-poppins text-base font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
