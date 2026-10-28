"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Anime } from "@/types/anime";

interface ContinueWatchingCardProps {
  anime: Anime;
}

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";

export default function ContinueWatchingCard({ anime }: ContinueWatchingCardProps) {
  const [thumb, setThumb] = useState(anime.banner || anime.poster || FALLBACK_THUMB);

  if (!anime.continueProgress) return null;

  const { episodeNumber, episodeTitle, progressPercentage, timestamp, totalTime } =
    anime.continueProgress;

  return (
    <Link
      href={`/anime/${anime.slug}/watch`}
      className="group flex flex-col w-full text-left transition-all duration-200"
    >
      {/* 16:9 Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-deep-navy border border-outline/60 shadow-card group-hover:border-electric-purple/70 group-hover:shadow-glow-purple transition-all duration-300">
        <Image
          src={thumb}
          alt={`${anime.title} Episode ${episodeNumber}`}
          fill
          unoptimized
          onError={() => setThumb(FALLBACK_THUMB)}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient dark scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-black/30" />

        {/* Central Play Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-midnight/40 backdrop-blur-[1px] transition-opacity duration-200">
          <div className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-outline/70 overflow-hidden">
          <div
            className="h-full bg-electric-purple shadow-glow-purple transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Timestamp badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-sm bg-midnight/80 backdrop-blur-md text-[11px] text-white/90 font-medium font-inter border border-white/10">
          {timestamp} / {totalTime}
        </div>
      </div>

      {/* Info below thumbnail */}
      <div className="mt-2.5 flex flex-col space-y-0.5">
        <div className="flex items-center justify-between text-xs text-soft-gray">
          <span className="font-medium text-electric-purple">Episode {episodeNumber}</span>
          <span>{progressPercentage}% watched</span>
        </div>
        <h4 className="font-poppins font-semibold text-sm sm:text-base text-white group-hover:text-electric-purple transition-colors line-clamp-1">
          {anime.title}
        </h4>
        <p className="text-xs text-muted line-clamp-1">{episodeTitle}</p>
      </div>
    </Link>
  );
}
