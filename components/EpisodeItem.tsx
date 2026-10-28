"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle2 } from "lucide-react";
import { Episode } from "@/types/anime";

interface EpisodeItemProps {
  animeSlug: string;
  episode: Episode;
  isActive?: boolean;
}

export default function EpisodeItem({
  animeSlug,
  episode,
  isActive = false,
}: EpisodeItemProps) {
  return (
    <Link
      href={`/anime/${animeSlug}/watch?ep=${episode.number}`}
      className={`group flex items-center gap-3.5 p-2.5 rounded-md border transition-all ${
        isActive
          ? "bg-slate-night border-l-4 border-l-electric-purple border-electric-purple/40 shadow-glow-purple"
          : "bg-deep-navy/60 border-outline hover:border-electric-purple/50 hover:bg-slate-night/80"
      }`}
    >
      {/* 16:9 Thumbnail with Play Icon */}
      <div className="relative aspect-video w-24 sm:w-28 shrink-0 rounded-sm overflow-hidden bg-midnight border border-outline/60">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          sizes="120px"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-glow-purple">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-midnight/90 text-[10px] text-soft-gray font-inter">
          {episode.duration}
        </div>
      </div>

      {/* Episode Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold font-poppins ${
              isActive ? "text-neon-pink" : "text-electric-purple"
            }`}
          >
            Episode {episode.number}
          </span>
          {episode.isWatched && (
            <span className="flex items-center gap-1 text-[10px] text-brand-green">
              <CheckCircle2 className="w-3 h-3" />
              Watched
            </span>
          )}
        </div>
        <h4 className="font-poppins font-medium text-sm text-white truncate group-hover:text-electric-purple transition-colors">
          {episode.title}
        </h4>
        {episode.synopsis && (
          <p className="text-xs text-soft-gray truncate mt-0.5 font-inter">
            {episode.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
}
