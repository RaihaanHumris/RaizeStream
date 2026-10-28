"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Play,
  Bookmark,
  Star,
  Film,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
} from "lucide-react";
import { Anime } from "@/types/anime";
import { getAnimeBySlug, getRecommendations } from "@/lib/api";
import EpisodeItem from "@/components/EpisodeItem";
import Carousel from "@/components/Carousel";

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const data = await getAnimeBySlug(slug);
      setAnime(data);
      if (data) {
        const recs = await getRecommendations(data.id);
        setRecommendations(recs);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-electric-purple/30 border-t-electric-purple animate-spin" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-outfit text-3xl font-bold text-white">Anime Not Found</h1>
        <p className="text-soft-gray text-base">
          The anime you are looking for might have been moved or is unavailable.
        </p>
        <Link
          href="/browse"
          className="inline-flex px-6 py-3 rounded-md bg-gradient-brand text-white font-poppins font-semibold shadow-glow-purple"
        >
          Browse All Anime
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-16">
      {/* 1. Backdrop Banner with Overlays */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] min-h-[380px] max-h-[580px] overflow-hidden">
        <Image
          src={anime.banner || anime.poster}
          alt={anime.title}
          fill
          unoptimized
          priority
          className="object-cover object-top opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/90 via-midnight/50 to-transparent" />
      </div>

      {/* 2. Main Content Info & Poster */}
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-12 -mt-36 sm:-mt-48 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Poster Box */}
          <div className="w-48 sm:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-deep-navy border border-outline shadow-card">
              <Image
                src={anime.poster}
                alt={anime.title}
                fill
                unoptimized
                priority
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-sm bg-midnight/85 backdrop-blur-md border border-brand-amber/30 text-brand-amber font-semibold text-xs shadow-sm">
                <Star className="w-3.5 h-3.5 fill-brand-amber text-brand-amber" />
                <span>{anime.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Quick Actions Mobile/Desktop Under Poster */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex-1 h-11 rounded-md border flex items-center justify-center gap-2 font-poppins font-medium text-xs transition-all ${
                  isBookmarked
                    ? "bg-neon-pink/15 border-neon-pink text-neon-pink shadow-glow-pink"
                    : "glass-panel border-outline text-soft-gray hover:text-white hover:border-electric-purple"
                }`}
              >
                {isBookmarked ? (
                  <>
                    <Check className="w-4 h-4" /> Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Add to Library
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: anime.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                aria-label="Share"
                className="w-11 h-11 rounded-md glass-panel border border-outline flex items-center justify-center text-soft-gray hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Anime Details */}
          <div className="flex-1 space-y-5">
            {/* Badges / Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-pink/15 text-neon-pink border border-neon-pink/30">
                {anime.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-night border border-outline text-soft-gray">
                {anime.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-night border border-outline text-soft-gray">
                {anime.season} {anime.year}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-night border border-outline text-soft-gray">
                {anime.episodesCount} Episodes
              </span>
            </div>

            {/* Title & Japanese Title */}
            <div>
              <h1 className="font-outfit font-bold text-2xl sm:text-4xl lg:text-[40px] text-white tracking-tight leading-tight">
                {anime.title}
              </h1>
              {anime.japaneseTitle && (
                <p className="text-soft-gray text-base mt-1 font-inter">
                  {anime.japaneseTitle}
                </p>
              )}
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {anime.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/browse?genre=${encodeURIComponent(genre)}`}
                  className="px-3.5 py-1 rounded-full bg-slate-night border border-outline text-xs text-soft-gray font-medium hover:text-white hover:border-electric-purple transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/anime/${anime.slug}/watch`}
                className="h-12 px-8 rounded-md bg-gradient-brand text-white font-poppins font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-glow-purple hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-white text-white" />
                Watch Now (EP 1)
              </Link>

              {anime.trailerUrl && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="h-12 px-6 rounded-md glass-panel border border-electric-purple text-white font-poppins font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-electric-purple/15 transition-all"
                >
                  <Film className="w-4 h-4 text-electric-purple" />
                  Trailer
                </button>
              )}
            </div>

            {/* Synopsis with Expand/Collapse */}
            <div className="pt-2 border-t border-outline/50 space-y-2">
              <h3 className="font-poppins font-semibold text-lg text-white">
                Synopsis
              </h3>
              <p
                className={`text-soft-gray text-sm sm:text-base font-inter leading-relaxed transition-all ${
                  synopsisExpanded ? "" : "line-clamp-3"
                }`}
              >
                {anime.synopsis}
              </p>
              <button
                onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                className="inline-flex items-center gap-1 text-xs font-poppins font-medium text-electric-purple hover:text-neon-pink transition-colors pt-1"
              >
                {synopsisExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-md bg-deep-navy/60 border border-outline text-xs">
              <div>
                <span className="text-muted block">Studio</span>
                <span className="text-white font-medium">{anime.studio}</span>
              </div>
              <div>
                <span className="text-muted block">Duration</span>
                <span className="text-white font-medium">{anime.duration}</span>
              </div>
              <div>
                <span className="text-muted block">Premiered</span>
                <span className="text-white font-medium">
                  {anime.season} {anime.year}
                </span>
              </div>
              <div>
                <span className="text-muted block">Ranked</span>
                <span className="text-white font-medium">
                  {anime.rank ? `#${anime.rank}` : "Top 100"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Episodes Section */}
        <section className="mt-14 space-y-6">
          <div className="flex items-center justify-between border-b border-outline/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-brand rounded-full" />
              <h2 className="font-outfit font-bold text-xl sm:text-2xl text-white">
                Episodes ({anime.episodes?.length || anime.episodesCount})
              </h2>
            </div>
            <span className="text-xs text-soft-gray font-medium">
              Audio: Sub / Dub
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {anime.episodes && anime.episodes.length > 0 ? (
              anime.episodes.map((ep) => (
                <EpisodeItem
                  key={ep.id}
                  animeSlug={anime.slug}
                  episode={ep}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-soft-gray text-sm">
                Episode list is currently updating. Click "Watch Now" to begin playback.
              </div>
            )}
          </div>
        </section>

        {/* 4. Recommendations Carousel */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <Carousel
              title="Recommended for You"
              items={recommendations}
              seeAllHref="/browse"
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && anime.trailerUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-md overflow-hidden bg-midnight border border-outline shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-midnight/80 text-white flex items-center justify-center hover:bg-neon-pink transition-colors"
            >
              &times;
            </button>
            <iframe
              src={anime.trailerUrl}
              title={`${anime.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
