import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Disc as DiscordIcon, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg border-t border-outline mt-auto pt-14 pb-20 md:pb-12 text-soft-gray">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-outline/50">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-md bg-gradient-brand flex items-center justify-center shadow-glow-purple">
                <span className="font-outfit font-extrabold text-white text-2xl tracking-tighter">
                  R
                </span>
              </div>
              <span className="font-outfit font-bold text-xl text-white">
                Raize<span className="text-neon-pink">Stream</span>
              </span>
            </Link>
            <p className="font-inter text-sm text-soft-gray leading-relaxed max-w-sm">
              Watch Anime. Rise Higher. The ultimate dark cinematic anime streaming destination designed for true fans.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-inter">
              <li>
                <Link href="#about" className="hover:text-electric-purple transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-electric-purple transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-electric-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-electric-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#dmca" className="hover:text-electric-purple transition-colors">
                  DMCA Notice
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Browse */}
          <div className="space-y-3">
            <h4 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
              Browse
            </h4>
            <ul className="space-y-2 text-sm font-inter">
              <li>
                <Link href="/browse" className="hover:text-electric-purple transition-colors">
                  All Anime
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Action" className="hover:text-electric-purple transition-colors">
                  Action & Adventure
                </Link>
              </li>
              <li>
                <Link href="/browse?genre=Fantasy" className="hover:text-electric-purple transition-colors">
                  Fantasy & Magic
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-electric-purple transition-colors">
                  Release Schedule
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=trending" className="hover:text-electric-purple transition-colors">
                  Trending Shows
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Social Media */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-white text-sm uppercase tracking-wider">
              Connect With Us
            </h4>
            <p className="text-xs text-soft-gray leading-relaxed">
              Join our growing community to discuss episodes, theories, and seasonal picks.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-white hover:border-electric-purple transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-neon-pink hover:border-neon-pink transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-electric-purple hover:border-electric-purple transition-all"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-brand-red hover:border-brand-red transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar — Copyright strictly centered */}
        <div className="pt-8 text-center">
          <p className="font-inter text-sm text-soft-gray/80">
            &copy; 2026 Raize Stream. Created by Muhammad Raihaan Humris
          </p>
        </div>
      </div>
    </footer>
  );
}
