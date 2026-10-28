"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Plus, Star, Sparkles, Check } from "lucide-react";
import { Anime } from "@/types/anime";

interface HeroBannerProps {
  featuredAnime: Anime[];
}

export default function HeroBanner({ featuredAnime }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (featuredAnime.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredAnime.length]);

  if (!featuredAnime || featuredAnime.length === 0) return null;

  const current = featuredAnime[currentIndex];
  const FALLBACK_HERO =
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80";

  return (
    <section className="relative w-full h-[72vh] min-h-[540px] max-h-[760px] overflow-hidden flex items-end">
      {/* Background Images with smooth fade */}
      {featuredAnime.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
          }`}
        >
          <Image
            src={anime.banner || anime.poster || FALLBACK_HERO}
            alt={anime.title}
            fill
            unoptimized
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out"
          />
          {/* Overlays for cinematic readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/70 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-midnight/20 backdrop-blur-[1px]" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-12 pb-14 md:pb-16 flex flex-col justify-end">
        <div className="max-w-2xl space-y-4">
          {/* Featured pill badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neon-pink/20 text-neon-pink border border-neon-pink/30 shadow-glow-pink">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Spotlight
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-amber/15 text-brand-amber border border-brand-amber/30">
              <Star className="w-3.5 h-3.5 fill-brand-amber text-brand-amber" />
              {current.rating.toFixed(1)}
            </span>
            <span className="text-xs text-soft-gray font-medium">
              {current.season} {current.year} • {current.type}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl lg:text-[56px] text-white leading-[1.1] tracking-tight line-clamp-2 drop-shadow-md">
            {current.title}
          </h1>

          {/* Japanese Title & Studio */}
          {current.japaneseTitle && (
            <p className="text-soft-gray text-sm md:text-base font-inter">
              {current.japaneseTitle} • <span className="text-white/80">{current.studio}</span>
            </p>
          )}

          {/* Genre Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {current.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full bg-slate-night/80 border border-outline text-xs text-soft-gray font-medium hover:border-electric-purple transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-soft-gray text-sm sm:text-base font-inter line-clamp-3 leading-relaxed max-w-xl">
            {current.synopsis}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/anime/${current.slug}/watch`}
              className="h-12 px-7 rounded-md bg-gradient-brand text-white font-poppins font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-glow-purple hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white text-white" />
              Watch Now
            </Link>

            <Link
              href={`/anime/${current.slug}`}
              className="h-12 px-6 rounded-md glass-panel border border-electric-purple text-white font-poppins font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-electric-purple/15 transition-all duration-200"
            >
              Details
            </Link>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Add to List"
              className={`w-12 h-12 rounded-md glass-panel border flex items-center justify-center transition-all ${
                isBookmarked
                  ? "border-neon-pink text-neon-pink bg-neon-pink/10 shadow-glow-pink"
                  : "border-outline text-soft-gray hover:text-white hover:border-white"
              }`}
            >
              {isBookmarked ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute right-4 md:right-12 bottom-14 flex items-center gap-2">
          {featuredAnime.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-gradient-brand shadow-glow-purple"
                  : "w-2 bg-outline hover:bg-soft-gray"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
