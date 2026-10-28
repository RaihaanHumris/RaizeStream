"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";
import { Anime } from "@/types/anime";

interface AnimeCardProps {
  anime: Anime;
  priority?: boolean;
}

const FALLBACK_POSTER =
  "https://cdn.myanimelist.net/images/anime/1565/141041l.jpg";

export default function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const [imgSrc, setImgSrc] = useState(anime.poster || FALLBACK_POSTER);

  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group flex flex-col w-full text-left transition-all duration-200"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-deep-navy border border-outline/50 shadow-card transition-all duration-300 group-hover:shadow-glow-purple group-hover:border-electric-purple/60">
        <Image
          src={imgSrc}3
          
          alt={anime.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          priority={priority}
          onError={() => setImgSrc(FALLBACK_POSTER)}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />

        {/* Rating Badge (Top Left, Amber) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-sm bg-midnight/80 backdrop-blur-md border border-brand-amber/30 text-brand-amber text-xs font-semibold shadow-sm">
          <Star className="w-3 h-3 fill-brand-amber text-brand-amber" />
          <span>{anime.rating.toFixed(1)}</span>
        </div>

        {/* Episode Count Badge (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-sm bg-slate-night/90 backdrop-blur-md border border-outline text-white text-[11px] font-medium font-inter">
          {anime.episodesCount ? `EP ${anime.episodesCount}` : "OVA"}
        </div>

        {/* Type or Status Badge (Top Right) */}
        {anime.status === "Airing" && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-sm bg-neon-pink/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-glow-pink">
            Airing
          </div>
        )}

        {/* Dark Hover Overlay with Central Play Button */}
        <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-glow-purple transform scale-75 group-hover:scale-100 transition-transform duration-250">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="mt-3 flex flex-col space-y-1">
        <h3 className="font-poppins font-semibold text-sm sm:text-base text-white group-hover:text-electric-purple transition-colors line-clamp-1">
          {anime.title}
        </h3>
        <p className="text-xs text-soft-gray line-clamp-1">
          {anime.genres.slice(0, 2).join(" • ")} {anime.year ? `• ${anime.year}` : ""}
        </p>
      </div>
    </Link>
  );
}
