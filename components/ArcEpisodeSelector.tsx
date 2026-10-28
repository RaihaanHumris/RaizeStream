"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Layers, Tv, Compass } from "lucide-react";
import { Anime, Episode, AnimeArc, AnimeSeason } from "@/types/anime";
import { getAnimeSeasons, getAnimeArcs } from "@/lib/api";
import EpisodeItem from "@/components/EpisodeItem";

interface ArcEpisodeSelectorProps {
  anime: Anime;
  currentEpisodeNum?: number;
  compact?: boolean; // Compact mode for Watch page sidebar
  onSelectEpisode?: (num: number) => void;
}

export default function ArcEpisodeSelector({
  anime,
  currentEpisodeNum,
  compact = false,
  onSelectEpisode,
}: ArcEpisodeSelectorProps) {
  const episodes = useMemo(() => anime.episodes || [], [anime.episodes]);
  const seasons = useMemo(
    () => (anime.seasons && anime.seasons.length > 0 ? anime.seasons : getAnimeSeasons(anime)),
    [anime]
  );
  const arcs = useMemo(
    () => (anime.arcs && anime.arcs.length > 0 ? anime.arcs : getAnimeArcs(anime)),
    [anime]
  );

  // Filter mode: "season" | "arc" | "all"
  const [filterMode, setFilterMode] = useState<"season" | "arc" | "all">(
    seasons.length > 1 ? "season" : arcs.length > 1 ? "arc" : "all"
  );

  // Initial selected Season & Arc IDs based on currentEpisodeNum
  const initialSeasonId = useMemo(() => {
    if (currentEpisodeNum && seasons.length > 0) {
      const found = seasons.find(
        (s) => currentEpisodeNum >= s.startEpisode && currentEpisodeNum <= s.endEpisode
      );
      if (found) return found.id;
    }
    return seasons[0]?.id || "all";
  }, [currentEpisodeNum, seasons]);

  const initialArcId = useMemo(() => {
    if (currentEpisodeNum && arcs.length > 0) {
      const found = arcs.find(
        (a) => currentEpisodeNum >= a.startEpisode && currentEpisodeNum <= a.endEpisode
      );
      if (found) return found.id;
    }
    return arcs[0]?.id || "all";
  }, [currentEpisodeNum, arcs]);

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(initialSeasonId);
  const [selectedArcId, setSelectedArcId] = useState<string>(initialArcId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [batchIndex, setBatchIndex] = useState<number>(0);

  // Sync selected season/arc when currentEpisodeNum changes
  useEffect(() => {
    if (currentEpisodeNum) {
      const foundSeason = seasons.find(
        (s) => currentEpisodeNum >= s.startEpisode && currentEpisodeNum <= s.endEpisode
      );
      if (foundSeason && foundSeason.id !== selectedSeasonId) {
        setSelectedSeasonId(foundSeason.id);
      }
      const foundArc = arcs.find(
        (a) => currentEpisodeNum >= a.startEpisode && currentEpisodeNum <= a.endEpisode
      );
      if (foundArc && foundArc.id !== selectedArcId) {
        setSelectedArcId(foundArc.id);
      }
    }
  }, [currentEpisodeNum, seasons, arcs, selectedSeasonId, selectedArcId]);

  // Reset batch index when filters change
  useEffect(() => {
    setBatchIndex(0);
  }, [filterMode, selectedSeasonId, selectedArcId, searchQuery]);

  // Active Season object
  const activeSeason = useMemo(() => {
    return seasons.find((s) => s.id === selectedSeasonId) || null;
  }, [seasons, selectedSeasonId]);

  // Active Arc object
  const activeArc = useMemo(() => {
    return arcs.find((a) => a.id === selectedArcId) || null;
  }, [arcs, selectedArcId]);

  // Filter episodes based on current mode & search query
  const filteredEpisodes = useMemo(() => {
    let list = episodes;

    if (filterMode === "season" && selectedSeasonId !== "all" && activeSeason) {
      list = list.filter(
        (e) => e.number >= activeSeason.startEpisode && e.number <= activeSeason.endEpisode
      );
    } else if (filterMode === "arc" && selectedArcId !== "all" && activeArc) {
      list = list.filter(
        (e) => e.number >= activeArc.startEpisode && e.number <= activeArc.endEpisode
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const numMatch = parseInt(q, 10);
      list = list.filter((e) => {
        if (!isNaN(numMatch)) {
          return e.number === numMatch || e.number.toString().includes(q);
        }
        return (
          e.title.toLowerCase().includes(q) ||
          e.number.toString() === q
        );
      });
    }

    return list;
  }, [episodes, filterMode, selectedSeasonId, activeSeason, selectedArcId, activeArc, searchQuery]);

  // Pagination / Batching
  const BATCH_SIZE = compact ? 25 : 36;
  const totalBatches = Math.ceil(filteredEpisodes.length / BATCH_SIZE) || 1;
  const paginatedEpisodes = useMemo(() => {
    const start = batchIndex * BATCH_SIZE;
    return filteredEpisodes.slice(start, start + BATCH_SIZE);
  }, [filteredEpisodes, batchIndex, BATCH_SIZE]);

  // Handle direct episode jump input
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const num = parseInt(searchQuery, 10);
    if (!isNaN(num) && num >= 1 && num <= (anime.episodesCount || episodes.length)) {
      const matchingSeason = seasons.find(
        (s) => num >= s.startEpisode && num <= s.endEpisode
      );
      if (matchingSeason) setSelectedSeasonId(matchingSeason.id);

      const matchingArc = arcs.find(
        (a) => num >= a.startEpisode && num <= a.endEpisode
      );
      if (matchingArc) setSelectedArcId(matchingArc.id);

      if (onSelectEpisode) {
        onSelectEpisode(num);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search & Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-deep-navy/90 p-3 rounded-md border border-outline">
        <form
          onSubmit={handleJumpSubmit}
          className="relative flex-1 flex items-center"
        >
          <Search className="w-4 h-4 text-soft-gray absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari / Lompat ke Ep. # (misal: 1071)"
            className="w-full bg-midnight/90 border border-outline rounded-md pl-9 pr-20 py-2 text-xs text-white placeholder-soft-gray focus:outline-none focus:border-electric-purple transition-colors"
          />
          {searchQuery && (
            <button
              type="submit"
              className="absolute right-1.5 px-2.5 py-1 bg-gradient-brand text-[11px] font-semibold text-white rounded shadow-sm hover:opacity-90 transition-opacity"
            >
              Lompat
            </button>
          )}
        </form>

        {/* Filter Mode Buttons (Season / Arc / All) */}
        <div className="flex items-center gap-1.5 bg-slate-night/80 p-1 rounded-md border border-outline shrink-0">
          <button
            onClick={() => setFilterMode("season")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              filterMode === "season"
                ? "bg-gradient-brand text-white shadow-sm"
                : "text-soft-gray hover:text-white"
            }`}
          >
            <Tv className="w-3 h-3" /> Season ({seasons.length})
          </button>
          {arcs.length > 0 && (
            <button
              onClick={() => setFilterMode("arc")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                filterMode === "arc"
                  ? "bg-gradient-brand text-white shadow-sm"
                  : "text-soft-gray hover:text-white"
              }`}
            >
              <Compass className="w-3 h-3" /> Arc ({arcs.length})
            </button>
          )}
          <button
            onClick={() => setFilterMode("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
              filterMode === "all"
                ? "bg-gradient-brand text-white shadow-sm"
                : "text-soft-gray hover:text-white"
            }`}
          >
            <Layers className="w-3 h-3" /> Semua
          </button>
        </div>
      </div>

      {/* Season or Arc Tabs Selector */}
      {filterMode === "season" && seasons.length > 0 && (
        <div className="space-y-2">
          {compact ? (
            <select
              value={selectedSeasonId}
              onChange={(e) => setSelectedSeasonId(e.target.value)}
              aria-label="Pilih Season Anime"
              className="w-full bg-midnight border border-outline rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-purple font-poppins"
            >
              <option value="all">Semua Season ({episodes.length} Ep)</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} (Ep {s.startEpisode} - {s.endEpisode})
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedSeasonId("all")}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSeasonId === "all"
                    ? "bg-gradient-brand text-white shadow-glow-purple"
                    : "glass-panel border border-outline text-soft-gray hover:text-white hover:border-electric-purple/50"
                }`}
              >
                <span>Semua Season</span>
                <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px]">
                  {episodes.length}
                </span>
              </button>
              {seasons.map((s) => {
                const isActive = selectedSeasonId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeasonId(s.id)}
                    className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-brand text-white shadow-glow-purple"
                        : "glass-panel border border-outline text-soft-gray hover:text-white hover:border-electric-purple/50"
                    }`}
                  >
                    <span>{s.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isActive ? "bg-black/30 text-white" : "bg-slate-night text-soft-gray"
                      }`}
                    >
                      Ep {s.startEpisode}-{s.endEpisode}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!compact && activeSeason && activeSeason.description && (
            <div className="p-3 rounded-md bg-slate-night/80 border border-electric-purple/30 text-xs text-soft-gray flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-electric-purple/20 text-neon-pink font-semibold shrink-0">
                {activeSeason.title}
              </span>
              <p className="leading-relaxed text-slate-300 font-inter">
                {activeSeason.description}
              </p>
            </div>
          )}
        </div>
      )}

      {filterMode === "arc" && arcs.length > 0 && (
        <div className="space-y-2">
          {compact ? (
            <select
              value={selectedArcId}
              onChange={(e) => setSelectedArcId(e.target.value)}
              aria-label="Pilih Story Arc"
              className="w-full bg-midnight border border-outline rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-purple font-poppins"
            >
              <option value="all">Semua Arc ({episodes.length} Ep)</option>
              {arcs.map((arc) => (
                <option key={arc.id} value={arc.id}>
                  {arc.title} (Ep {arc.startEpisode} - {arc.endEpisode})
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedArcId("all")}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedArcId === "all"
                    ? "bg-gradient-brand text-white shadow-glow-purple"
                    : "glass-panel border border-outline text-soft-gray hover:text-white hover:border-electric-purple/50"
                }`}
              >
                <span>Semua Arc</span>
                <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px]">
                  {episodes.length}
                </span>
              </button>
              {arcs.map((arc) => {
                const isActive = selectedArcId === arc.id;
                return (
                  <button
                    key={arc.id}
                    onClick={() => setSelectedArcId(arc.id)}
                    className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-brand text-white shadow-glow-purple"
                        : "glass-panel border border-outline text-soft-gray hover:text-white hover:border-electric-purple/50"
                    }`}
                  >
                    <span>{arc.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isActive ? "bg-black/30 text-white" : "bg-slate-night text-soft-gray"
                      }`}
                    >
                      {arc.startEpisode}-{arc.endEpisode}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!compact && activeArc && activeArc.description && (
            <div className="p-3 rounded-md bg-slate-night/80 border border-electric-purple/30 text-xs text-soft-gray flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-electric-purple/20 text-neon-pink font-semibold shrink-0">
                {activeArc.title}
              </span>
              <p className="leading-relaxed text-slate-300 font-inter">
                {activeArc.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Batch / Page Pagination Controls for large lists */}
      {totalBatches > 1 && (
        <div className="flex items-center justify-between text-xs text-soft-gray bg-midnight/50 p-2 rounded border border-outline/40">
          <span>
            Halaman {batchIndex + 1} dari {totalBatches} ({filteredEpisodes.length} Episode)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={batchIndex === 0}
              onClick={() => setBatchIndex((prev) => Math.max(0, prev - 1))}
              className="px-2.5 py-1 rounded bg-slate-night border border-outline disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
            >
              Sebelumnya
            </button>
            <button
              disabled={batchIndex >= totalBatches - 1}
              onClick={() => setBatchIndex((prev) => Math.min(totalBatches - 1, prev + 1))}
              className="px-2.5 py-1 rounded bg-slate-night border border-outline disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Episodes Grid / List */}
      {paginatedEpisodes.length > 0 ? (
        <div
          className={`grid gap-3.5 ${
            compact
              ? "grid-cols-1 max-h-[580px] overflow-y-auto pr-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {paginatedEpisodes.map((ep) => (
            <EpisodeItem
              key={ep.id}
              animeSlug={anime.slug}
              episode={ep}
              isActive={currentEpisodeNum === ep.number}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-soft-gray text-xs sm:text-sm bg-deep-navy/40 rounded-md border border-outline/50 space-y-2">
          <p>Tidak ada episode yang cocok dengan pencarian &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSeasonId("all");
              setSelectedArcId("all");
              setFilterMode("all");
            }}
            className="text-electric-purple font-semibold hover:underline"
          >
            Tampilkan Semua Episode
          </button>
        </div>
      )}
    </div>
  );
}
