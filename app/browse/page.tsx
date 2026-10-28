"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import { Anime } from "@/types/anime";
import { allGenres } from "@/data/anime";

const statuses = ["All", "Airing", "Completed", "Upcoming"];
const types = ["All", "TV", "Movie", "OVA"];
const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating" },
  { label: "Latest Release", value: "new" },
  { label: "Alphabetical (A-Z)", value: "title" },
];

function BrowseContent() {
  const searchParams = useSearchParams();

  const initialGenre = searchParams?.get("genre") || "All";
  const initialSort = searchParams?.get("sort") || "popular";

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch anime based on selected filters
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedGenre !== "All") params.set("genre", selectedGenre);
      if (selectedStatus !== "All") params.set("status", selectedStatus);
      if (selectedType !== "All") params.set("type", selectedType);
      if (sortBy) params.set("sort", sortBy);
      params.set("page", String(page));

      try {
        const res = await fetch(`/api/anime?${params.toString()}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Error fetching anime:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedGenre, selectedStatus, selectedType, sortBy, page]);

  const resetFilters = () => {
    setQuery("");
    setSelectedGenre("All");
    setSelectedStatus("All");
    setSelectedType("All");
    setSortBy("popular");
    setPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 space-y-8">
      {/* Page Title & Search Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline/50 pb-6">
        <div>
          <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white">
            Browse Anime
          </h1>
          <p className="text-soft-gray text-sm mt-1">
            Discover thousands of anime series, movies, and current seasonal releases.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title..."
              className="w-full h-11 pl-10 pr-4 rounded-md bg-slate-night/90 border border-outline text-sm text-white placeholder-muted focus:outline-none focus:border-electric-purple"
            />
            <Search className="w-4 h-4 text-soft-gray absolute left-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden h-11 px-4 rounded-md glass-panel border border-outline flex items-center gap-2 text-sm text-white hover:border-electric-purple"
          >
            <Filter className="w-4 h-4 text-electric-purple" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Anime Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 lg:block space-y-6 p-5 rounded-md bg-deep-navy border border-outline ${
            mobileFilterOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between border-b border-outline pb-3">
            <div className="flex items-center gap-2 text-white font-poppins font-semibold text-base">
              <SlidersHorizontal className="w-4 h-4 text-electric-purple" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="text-xs text-soft-gray hover:text-neon-pink flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Genre Filter Pills */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-soft-gray uppercase tracking-wider block">
              Genre
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedGenre === genre
                      ? "bg-gradient-brand text-white shadow-glow-purple font-semibold"
                      : "bg-slate-night/80 border border-outline text-soft-gray hover:text-white hover:border-electric-purple"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-soft-gray uppercase tracking-wider block">
              Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedStatus(st);
                    setPage(1);
                  }}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-all ${
                    selectedStatus === st
                      ? "bg-electric-purple/20 border-electric-purple text-electric-purple font-semibold"
                      : "bg-slate-night/60 border-outline text-soft-gray hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter (TV, Movie, OVA) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-soft-gray uppercase tracking-wider block">
              Format
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {types.map((tp) => (
                <button
                  key={tp}
                  onClick={() => {
                    setSelectedType(tp);
                    setPage(1);
                  }}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-all ${
                    selectedType === tp
                      ? "bg-electric-purple/20 border-electric-purple text-electric-purple font-semibold"
                      : "bg-slate-night/60 border-outline text-soft-gray hover:text-white"
                  }`}
                >
                  {tp}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Grid & Sorting Bar */}
        <section className="lg:col-span-9 space-y-6">
          {/* Sorting and Results Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-md bg-deep-navy/60 border border-outline text-xs">
            <span className="text-soft-gray font-inter">
              Showing <strong className="text-white">{items.length}</strong> results
              {selectedGenre !== "All" && ` in ${selectedGenre}`}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-muted">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-night border border-outline rounded-md px-3 py-1.5 text-white text-xs focus:outline-none focus:border-electric-purple cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-night text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anime Grid (2 mobile, 4 tablet, 6 desktop as per DESIGN.md) */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="aspect-[2/3] w-full bg-slate-night rounded-md" />
                  <div className="h-4 bg-slate-night rounded w-3/4" />
                  <div className="h-3 bg-slate-night rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {items.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 p-8 rounded-md bg-deep-navy/40 border border-outline">
              <p className="text-white font-poppins text-lg font-semibold">
                No Anime Found
              </p>
              <p className="text-soft-gray text-sm max-w-md mx-auto">
                No titles matched your current filter criteria. Try resetting or adjusting your search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-5 py-2 rounded-md bg-gradient-brand text-white font-poppins text-xs font-semibold shadow-glow-purple"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {items.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-outline/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-10 px-4 rounded-md glass-panel border border-outline flex items-center gap-1.5 text-xs font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-electric-purple"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-soft-gray font-poppins px-3 py-1.5 rounded bg-slate-night border border-outline">
                Page <strong className="text-white">{page}</strong>
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="h-10 px-4 rounded-md glass-panel border border-outline flex items-center gap-1.5 text-xs font-medium text-white hover:border-electric-purple"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-electric-purple/30 border-t-electric-purple animate-spin" />
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
