"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Info, Bookmark, Share2 } from "lucide-react";
import { Anime, Episode } from "@/types/anime";
import { getAnimeBySlug } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import EpisodeItem from "@/components/EpisodeItem";
import ArcEpisodeSelector from "@/components/ArcEpisodeSelector";
import CommentSection from "@/components/CommentSection";

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params?.slug as string;
  const currentEpNum = Number(searchParams?.get("ep")) || 1;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const data = await getAnimeBySlug(slug);
      setAnime(data);
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
        <h1 className="font-outfit text-3xl font-bold text-white">Video Unavailable</h1>
        <Link
          href="/browse"
          className="inline-flex px-6 py-3 rounded-md bg-gradient-brand text-white font-poppins font-semibold shadow-glow-purple"
        >
          Return to Browse
        </Link>
      </div>
    );
  }

  const episodes = anime.episodes || [];
  const currentEpisode: Episode = episodes.find((e) => e.number === currentEpNum) || {
    id: `${anime.id}-ep-${currentEpNum}`,
    number: currentEpNum,
    title: `Episode ${currentEpNum}`,
    thumbnail: anime.banner || anime.poster,
    duration: "24m",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  };

  const hasPrev = currentEpNum > 1;
  const hasNext = currentEpNum < (episodes.length || anime.episodesCount);

  const goToEpisode = (num: number) => {
    router.push(`/anime/${anime.slug}/watch?ep=${num}`);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-6 space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-soft-gray">
        <Link
          href={`/anime/${anime.slug}`}
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-electric-purple" /> Back to Overview
        </Link>
        <span className="text-muted">
          Streaming in <strong className="text-white">Full HD (1080p)</strong>
        </span>
      </div>

      {/* Main Watch Layout: 70% Player / 30% Sidebar on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 of 12 cols = ~67%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Custom Video Player */}
          <VideoPlayer
            title={anime.title}
            episodeNumber={currentEpNum}
            animeId={anime.id}
            videoUrl={currentEpisode.videoUrl}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => goToEpisode(currentEpNum - 1)}
            onNext={() => goToEpisode(currentEpNum + 1)}
          />

          {/* Episode Info & Title */}
          <div className="space-y-3 p-4 sm:p-6 rounded-md bg-deep-navy border border-outline">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-neon-pink uppercase tracking-wider">
                  Now Playing • Episode {currentEpNum}
                </span>
                <h1 className="font-outfit font-bold text-xl sm:text-2xl text-white mt-1">
                  {anime.title}
                </h1>
                <h2 className="text-sm text-soft-gray font-poppins mt-0.5">
                  {currentEpisode.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  href={`/anime/${anime.slug}`}
                  className="h-9 px-3 rounded-md glass-panel border border-outline text-xs text-soft-gray hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" /> Details
                </Link>
                <button
                  onClick={() => alert("Added to your watchlist")}
                  className="h-9 px-3 rounded-md glass-panel border border-outline text-xs text-soft-gray hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>

            {currentEpisode.synopsis && (
              <p className="text-xs sm:text-sm text-soft-gray font-inter leading-relaxed pt-2 border-t border-outline/50">
                {currentEpisode.synopsis}
              </p>
            )}
          </div>

          {/* Comment Section Underneath */}
          <CommentSection />
        </div>

        {/* Right Column (4 of 12 cols = ~33% Episode Sidebar) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-md bg-deep-navy border border-outline space-y-4">
            <div className="flex items-center justify-between border-b border-outline pb-3">
              <h3 className="font-poppins font-semibold text-white text-base">
                Daftar Arc & Episode
              </h3>
              <span className="text-xs text-electric-purple font-medium">
                {episodes.length || anime.episodesCount} Total
              </span>
            </div>

            <ArcEpisodeSelector
              anime={anime}
              currentEpisodeNum={currentEpNum}
              compact={true}
              onSelectEpisode={(num) => goToEpisode(num)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[70vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-electric-purple/30 border-t-electric-purple animate-spin" />
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
