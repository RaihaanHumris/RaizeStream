"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import ContinueWatchingCard from "./ContinueWatchingCard";
import { Anime } from "@/types/anime";

interface CarouselProps {
  title: string;
  seeAllHref?: string;
  items: Anime[];
  variant?: "standard" | "continue";
}

export default function Carousel({
  title,
  seeAllHref = "/browse",
  items,
  variant = "standard",
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" ? -container.clientWidth * 0.75 : container.clientWidth * 0.75;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full my-8 md:my-12">
      {/* Header: Title, Controls, See All */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-brand rounded-full" />
          <h2 className="font-outfit font-bold text-xl sm:text-2xl md:text-[28px] text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={seeAllHref}
            className="text-xs sm:text-sm font-poppins font-medium text-electric-purple hover:text-neon-pink transition-colors pr-2"
          >
            See All &rarr;
          </Link>

          {/* Desktop Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-white hover:border-electric-purple transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-soft-gray hover:text-white hover:border-electric-purple transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-start gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {items.map((anime) => (
          <div
            key={anime.id}
            className={`shrink-0 transition-all ${
              variant === "continue"
                ? "w-[260px] sm:w-[300px] md:w-[340px]"
                : "w-[140px] sm:w-[175px] md:w-[195px] lg:w-[210px]"
            }`}
          >
            {variant === "continue" ? (
              <ContinueWatchingCard anime={anime} />
            ) : (
              <AnimeCard anime={anime} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
