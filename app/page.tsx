import React from "react";
import HeroBanner from "@/components/HeroBanner";
import Carousel from "@/components/Carousel";
import { animeList } from "@/data/anime";
import { getTopAnime, getSeasonNowAnime, getTopRatedAnime } from "@/lib/api";

export default async function HomePage() {
  // Fetch live API data with automatic fallback
  const [topAnime, seasonNow, topRatedLive] = await Promise.all([
    getTopAnime(),
    getSeasonNowAnime(),
    getTopRatedAnime(),
  ]);

  const featured = topAnime.slice(0, 5);
  const continueWatching = animeList.filter((a) => a.continueProgress);
  const trending = topAnime.slice(0, 10);
  const newEpisodes = seasonNow.slice(0, 10);
  const popularSeason = seasonNow.slice(0, 10);
  const topRated = topRatedLive.slice(0, 10);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner */}
      <HeroBanner featuredAnime={featured} />

      {/* Main Content Container with standard spacing from DESIGN.md */}
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-12 space-y-6 md:space-y-10 -mt-6 md:-mt-8 relative z-20">
        {/* 2. Continue Watching (16:9 Landscape with Progress) */}
        {continueWatching.length > 0 && (
          <Carousel
            title="Continue Watching"
            items={continueWatching}
            variant="continue"
            seeAllHref="/browse?tab=continue"
          />
        )}

        {/* 3. Trending Now */}
        <Carousel
          title="Trending Now"
          items={trending}
          seeAllHref="/browse?sort=trending"
        />

        {/* 4. New Episodes */}
        <Carousel
          title="New Episodes"
          items={newEpisodes}
          seeAllHref="/browse?sort=new"
        />

        {/* 5. Popular This Season */}
        <Carousel
          title="Popular This Season"
          items={popularSeason}
          seeAllHref="/browse?season=winter"
        />

        {/* 6. Top Rated */}
        <Carousel
          title="Top Rated Anime"
          items={topRated}
          seeAllHref="/browse?sort=rating"
        />
      </div>
    </div>
  );
}
