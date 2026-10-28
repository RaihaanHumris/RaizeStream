import { Anime, Episode, AnimeArc, AnimeSeason } from "@/types/anime";
import { animeList } from "@/data/anime";

const ANILIST_URL = "https://graphql.anilist.co";
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// Utility to create URL-friendly slug
export function createSlug(id: number | string, title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${id}-${cleanTitle}`;
}

export function getIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[0];
}

// Convert AniList media to Anime
export function mapAniListToAnime(media: any): Anime {
  const id = String(media.id);
  const title = media.title?.english || media.title?.romaji || "Untitled Anime";
  const slug = createSlug(media.id, title);

  const poster =
    media.coverImage?.extraLarge ||
    media.coverImage?.large ||
    media.coverImage?.medium ||
    "https://cdn.myanimelist.net/images/anime/1565/141041l.jpg";

  const banner =
    media.bannerImage ||
    media.coverImage?.extraLarge ||
    poster;

  const rating = media.averageScore
    ? Number((media.averageScore / 10).toFixed(1))
    : 8.5;

  const episodesCount = media.episodes || 12;

  const episodes: Episode[] = Array.from(
    { length: Math.min(episodesCount, 24) },
    (_, i) => {
      const num = i + 1;
      return {
        id: `${id}-ep-${num}`,
        number: num,
        title: `Episode ${num}`,
        thumbnail: banner || poster,
        duration: media.duration ? `${media.duration}m` : "24m",
        isWatched: num <= 2,
        synopsis: `Episode ${num} of ${title}. Stream now in Full HD.`,
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      };
    }
  );

  return {
    id,
    slug,
    title,
    japaneseTitle: media.title?.native || "",
    poster,
    banner,
    rating,
    genres: media.genres && media.genres.length > 0 ? media.genres : ["Action", "Adventure"],
    episodesCount,
    synopsis:
      media.description?.replace(/<[^>]*>?/gm, "").trim() ||
      "An exciting anime series streaming in high definition on Raize Stream.",
    status: media.status === "RELEASING" ? "Airing" : "Completed",
    season: media.season
      ? media.season.charAt(0) + media.season.slice(1).toLowerCase()
      : "Winter",
    year: media.seasonYear || media.startDate?.year || 2024,
    studio: media.studios?.nodes?.[0]?.name || "Animation Studio",
    type: media.format === "MOVIE" ? "Movie" : media.format === "OVA" ? "OVA" : "TV",
    duration: media.duration ? `${media.duration} min` : "24 min per ep",
    rank: media.popularity || 1,
    featured: rating >= 8.5,
    isTrending: true,
    isNewEpisode: media.status === "RELEASING",
    isPopularSeason: true,
    isTopRated: rating >= 8.5,
    trailerUrl:
      media.trailer?.site === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${media.trailer.id}?autoplay=1`
        : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(title + " Anime Trailer")}&autoplay=1`,
    episodes,
    continueProgress:
      media.id % 2 === 0
        ? {
            episodeNumber: 4,
            episodeTitle: `Episode 4 - Rising Power`,
            progressPercentage: 72,
            timestamp: "17:15",
            totalTime: "24:00",
          }
        : undefined,
  };
}

// Convert Jikan to Anime
export function mapJikanToAnime(item: any): Anime {
  const id = String(item.mal_id);
  const title = item.title_english || item.title || "Untitled Anime";
  const slug = createSlug(item.mal_id, title);
  const poster =
    item.images?.webp?.large_image_url ||
    item.images?.jpg?.large_image_url ||
    item.images?.jpg?.image_url ||
    "https://cdn.myanimelist.net/images/anime/1565/141041l.jpg";

  const banner =
    item.trailer?.images?.maximum_image_url ||
    item.trailer?.images?.large_image_url ||
    item.images?.jpg?.large_image_url ||
    poster;

  const genres =
    item.genres?.map((g: any) => g.name) ||
    item.themes?.map((t: any) => t.name) ||
    ["Action", "Fantasy"];

  const episodesCount = item.episodes || 12;

  const episodes: Episode[] = Array.from(
    { length: Math.min(episodesCount, 24) },
    (_, i) => ({
      id: `${id}-ep-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: banner || poster,
      duration: item.duration ? item.duration.split(" ")[0] + "m" : "24m",
      isWatched: i < 2,
      synopsis: `Episode ${i + 1} of ${title}.`,
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    })
  );

  return {
    id,
    slug,
    title,
    japaneseTitle: item.title_japanese || "",
    poster,
    banner,
    rating: typeof item.score === "number" ? item.score : 8.5,
    genres: genres.length > 0 ? genres : ["Anime"],
    episodesCount,
    synopsis: item.synopsis || "No synopsis available for this title yet.",
    status:
      item.status === "Currently Airing"
        ? "Airing"
        : item.status === "Finished Airing"
        ? "Completed"
        : "Upcoming",
    season: item.season
      ? item.season.charAt(0).toUpperCase() + item.season.slice(1)
      : "Winter",
    year: item.year || item.aired?.prop?.from?.year || 2024,
    studio: item.studios?.[0]?.name || "Animation Studio",
    type: item.type === "Movie" ? "Movie" : item.type === "OVA" ? "OVA" : "TV",
    duration: item.duration || "24 min per ep",
    rank: item.rank || 0,
    featured: (item.score || 0) >= 8.8,
    isTrending: true,
    isNewEpisode: item.status === "Currently Airing",
    isPopularSeason: true,
    isTopRated: (item.score || 0) >= 8.7,
    trailerUrl: item.trailer?.embed_url || undefined,
    episodes,
  };
}

// AniList GraphQL Fetcher
async function fetchAniList(query: string, variables: any = {}): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      next: { revalidate: 1800 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.Page?.media || null;
  } catch (e) {
    return null;
  }
}

// Jikan Fetcher
async function fetchJikan(url: string): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    return null;
  }
}

// 1. Get Top Trending Anime (Queries AniList first, then Jikan, then Mock)
export async function getTopAnime(): Promise<Anime[]> {
  const anilistQuery = `
    query {
      Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          id
          title { english romaji native }
          coverImage { extraLarge large medium }
          bannerImage
          averageScore
          genres
          episodes
          description
          status
          season
          seasonYear
          format
          duration
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    }
  `;

  const anilistData = await fetchAniList(anilistQuery);
  if (anilistData && Array.isArray(anilistData) && anilistData.length > 0) {
    return anilistData.map(mapAniListToAnime);
  }

  const jikanData = await fetchJikan(
    `${JIKAN_BASE_URL}/top/anime?filter=bypopularity&limit=12`
  );
  if (jikanData && Array.isArray(jikanData) && jikanData.length > 0) {
    return jikanData.map(mapJikanToAnime);
  }

  return animeList;
}

// 2. Get Popular Anime This Season
export async function getSeasonNowAnime(): Promise<Anime[]> {
  const anilistQuery = `
    query {
      Page(page: 1, perPage: 12) {
        media(type: ANIME, season: WINTER, seasonYear: 2026, sort: POPULARITY_DESC, isAdult: false) {
          id
          title { english romaji native }
          coverImage { extraLarge large medium }
          bannerImage
          averageScore
          genres
          episodes
          description
          status
          season
          seasonYear
          format
          duration
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    }
  `;

  const anilistData = await fetchAniList(anilistQuery);
  if (anilistData && Array.isArray(anilistData) && anilistData.length > 0) {
    return anilistData.map(mapAniListToAnime);
  }

  const jikanData = await fetchJikan(`${JIKAN_BASE_URL}/seasons/now?limit=12`);
  if (jikanData && Array.isArray(jikanData) && jikanData.length > 0) {
    return jikanData.map(mapJikanToAnime);
  }

  return animeList.filter((a) => a.isPopularSeason || a.status === "Airing");
}

// 3. Get Top Rated Anime
export async function getTopRatedAnime(): Promise<Anime[]> {
  const anilistQuery = `
    query {
      Page(page: 1, perPage: 12) {
        media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
          id
          title { english romaji native }
          coverImage { extraLarge large medium }
          bannerImage
          averageScore
          genres
          episodes
          description
          status
          season
          seasonYear
          format
          duration
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    }
  `;

  const anilistData = await fetchAniList(anilistQuery);
  if (anilistData && Array.isArray(anilistData) && anilistData.length > 0) {
    return anilistData.map(mapAniListToAnime);
  }

  const jikanData = await fetchJikan(
    `${JIKAN_BASE_URL}/top/anime?filter=favorite&limit=12`
  );
  if (jikanData && Array.isArray(jikanData) && jikanData.length > 0) {
    return jikanData.map(mapJikanToAnime);
  }

  return animeList.filter((a) => a.isTopRated);
}

// 4. Search & Filter Anime
export async function searchAnime(params: {
  query?: string;
  genre?: string;
  status?: string;
  type?: string;
  sort?: string;
  page?: number;
}): Promise<{ items: Anime[]; pagination?: any }> {
  const { query, genre, status, type, sort, page = 1 } = params;

  // Build AniList Query
  let sortVariable = "POPULARITY_DESC";
  if (sort === "rating") sortVariable = "SCORE_DESC";
  else if (sort === "title") sortVariable = "TITLE_ROMAJI";
  else if (sort === "new") sortVariable = "START_DATE_DESC";

  const anilistQuery = `
    query ($page: Int, $search: String, $genre: String) {
      Page(page: $page, perPage: 24) {
        pageInfo {
          currentPage
          hasNextPage
          total
        }
        media(type: ANIME, search: $search, genre: $genre, sort: [${sortVariable}], isAdult: false) {
          id
          title { english romaji native }
          coverImage { extraLarge large medium }
          bannerImage
          averageScore
          genres
          episodes
          description
          status
          season
          seasonYear
          format
          duration
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    }
  `;

  const variables: any = { page };
  if (query) variables.search = query;
  if (genre && genre !== "All") variables.genre = genre;

  try {
    const anilistRes = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: anilistQuery, variables }),
    });

    if (anilistRes.ok) {
      const data = await anilistRes.json();
      const mediaList = data?.data?.Page?.media;
      if (Array.isArray(mediaList) && mediaList.length > 0) {
        let items = mediaList.map(mapAniListToAnime);
        if (status && status !== "All") {
          items = items.filter(
            (a) => a.status.toLowerCase() === status.toLowerCase()
          );
        }
        if (type && type !== "All") {
          items = items.filter((a) => a.type.toLowerCase() === type.toLowerCase());
        }
        return { items, pagination: data?.data?.Page?.pageInfo };
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  // Fallback to local mock data filtering
  let filtered = [...animeList];
  if (query) {
    filtered = filtered.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (genre && genre !== "All") {
    filtered = filtered.filter((a) =>
      a.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }
  if (status && status !== "All") {
    filtered = filtered.filter(
      (a) => a.status.toLowerCase() === status.toLowerCase()
    );
  }
  if (type && type !== "All") {
    filtered = filtered.filter((a) => a.type.toLowerCase() === type.toLowerCase());
  }
  if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "new") {
    filtered.sort((a, b) => b.year - a.year);
  }

  return { items: filtered };
}

// Helper to get or auto-generate canonical seasons for any anime
export function getAnimeSeasons(anime: Partial<Anime>): AnimeSeason[] {
  if (anime.seasons && anime.seasons.length > 0) {
    return anime.seasons;
  }

  const total = anime.episodesCount || (anime.episodes ? anime.episodes.length : 12);
  const animeId = anime.id || "anime";
  const slugLower = anime.slug ? anime.slug.toLowerCase() : "";

  if (slugLower.includes("one-piece") || animeId === "13") {
    return [
      { id: `${animeId}-s1`, seasonNumber: 1, title: "Season 1: East Blue", startEpisode: 1, endEpisode: 61, year: 1999, description: "East Blue Saga (Episode 1 - 61)" },
      { id: `${animeId}-s2`, seasonNumber: 2, title: "Season 2: Alabasta", startEpisode: 62, endEpisode: 135, year: 2001, description: "Alabasta Saga (Episode 62 - 135)" },
      { id: `${animeId}-s3`, seasonNumber: 3, title: "Season 3: Skypiea", startEpisode: 136, endEpisode: 206, year: 2002, description: "Skypiea Saga (Episode 136 - 206)" },
      { id: `${animeId}-s4`, seasonNumber: 4, title: "Season 4: Water 7 & Enies Lobby", startEpisode: 207, endEpisode: 325, year: 2004, description: "Water 7 & Enies Lobby Saga (Episode 207 - 325)" },
      { id: `${animeId}-s5`, seasonNumber: 5, title: "Season 5: Thriller Bark", startEpisode: 326, endEpisode: 384, year: 2007, description: "Thriller Bark Saga (Episode 326 - 384)" },
      { id: `${animeId}-s6`, seasonNumber: 6, title: "Season 6: Summit War", startEpisode: 385, endEpisode: 516, year: 2008, description: "Summit War & Marineford Saga (Episode 385 - 516)" },
      { id: `${animeId}-s7`, seasonNumber: 7, title: "Season 7: Fishman Island", startEpisode: 517, endEpisode: 574, year: 2011, description: "Fishman Island Saga (Episode 517 - 574)" },
      { id: `${animeId}-s8`, seasonNumber: 8, title: "Season 8: Dressrosa", startEpisode: 575, endEpisode: 746, year: 2012, description: "Dressrosa Saga (Episode 575 - 746)" },
      { id: `${animeId}-s9`, seasonNumber: 9, title: "Season 9: Whole Cake Island", startEpisode: 747, endEpisode: 889, year: 2016, description: "Whole Cake Island Saga (Episode 747 - 889)" },
      { id: `${animeId}-s10`, seasonNumber: 10, title: "Season 10: Wano Country", startEpisode: 890, endEpisode: 1085, year: 2019, description: "Wano Country Saga (Episode 890 - 1085)" },
      { id: `${animeId}-s11`, seasonNumber: 11, title: "Season 11: Egghead Arc", startEpisode: 1086, endEpisode: 1122, year: 2023, description: "Egghead Island Arc (Episode 1086 - 1122)" }
    ];
  }

  if (slugLower.includes("jujutsu-kaisen") || animeId === "2") {
    return [
      { id: `${animeId}-s1`, seasonNumber: 1, title: "Season 1", startEpisode: 1, endEpisode: 24, year: 2020, description: "Episode 1 - 24: Awal Yuji Itadori dan Kyoto Goodwill Event." },
      { id: `${animeId}-s2`, seasonNumber: 2, title: "Season 2: Hidden Inventory & Shibuya", startEpisode: 25, endEpisode: 47, year: 2023, description: "Episode 25 - 47: Masa lalu Gojo & Insiden Shibuya." },
      { id: `${animeId}-s3`, seasonNumber: 3, title: "Season 3: Culling Game", startEpisode: 48, endEpisode: 71, year: 2026, description: "Episode 48 - 71: Culling Game Arc." }
    ];
  }

  if (slugLower.includes("demon-slayer") || animeId === "3") {
    return [
      { id: `${animeId}-s1`, seasonNumber: 1, title: "Season 1: Tanjiro Kamado Unwavering Resolve", startEpisode: 1, endEpisode: 26, year: 2019, description: "Episode 1 - 26" },
      { id: `${animeId}-s2`, seasonNumber: 2, title: "Season 2: Entertainment District", startEpisode: 27, endEpisode: 44, year: 2021, description: "Episode 27 - 44" },
      { id: `${animeId}-s3`, seasonNumber: 3, title: "Season 3: Swordsmith Village", startEpisode: 45, endEpisode: 55, year: 2023, description: "Episode 45 - 55" },
      { id: `${animeId}-s4`, seasonNumber: 4, title: "Season 4: Infinity Castle", startEpisode: 56, endEpisode: 68, year: 2026, description: "Episode 56 - 68" }
    ];
  }

  if (slugLower.includes("attack-on-titan") || animeId === "7") {
    return [
      { id: `${animeId}-s1`, seasonNumber: 1, title: "Season 1", startEpisode: 1, endEpisode: 25, year: 2013, description: "Episode 1 - 25" },
      { id: `${animeId}-s2`, seasonNumber: 2, title: "Season 2", startEpisode: 26, endEpisode: 37, year: 2017, description: "Episode 26 - 37" },
      { id: `${animeId}-s3`, seasonNumber: 3, title: "Season 3", startEpisode: 38, endEpisode: 59, year: 2018, description: "Episode 38 - 59" },
      { id: `${animeId}-s4`, seasonNumber: 4, title: "Season 4: The Final Chapters", startEpisode: 60, endEpisode: 89, year: 2023, description: "Episode 60 - 89" }
    ];
  }

  const chunkSize = total > 48 ? 24 : total;
  const seasons: AnimeSeason[] = [];
  let currentStart = 1;
  let sNum = 1;

  while (currentStart <= total) {
    const currentEnd = Math.min(currentStart + chunkSize - 1, total);
    seasons.push({
      id: `${animeId}-s${sNum}`,
      seasonNumber: sNum,
      title: `Season ${sNum}`,
      startEpisode: currentStart,
      endEpisode: currentEnd,
      year: (anime.year || 2024) + (sNum - 1),
      episodesCount: currentEnd - currentStart + 1,
      description: `Season ${sNum} (Episode ${currentStart} - ${currentEnd}) Subtitle Indonesia HD.`
    });
    currentStart = currentEnd + 1;
    sNum++;
  }

  return seasons;
}

// Helper to get or auto-generate canonical story arcs for any anime
export function getAnimeArcs(anime: Partial<Anime>): AnimeArc[] {
  if (anime.arcs && anime.arcs.length > 0) {
    return anime.arcs;
  }

  const total = anime.episodesCount || (anime.episodes ? anime.episodes.length : 12);

  if (total <= 13) {
    return [
      {
        id: `${anime.id || "anime"}-arc-1`,
        title: "Arc Utama",
        startEpisode: 1,
        endEpisode: total,
        description: `Seluruh ${total} episode dalam 1 arc utama.`
      }
    ];
  }

  if (total <= 26) {
    return [
      {
        id: `${anime.id || "anime"}-arc-1`,
        title: "Cour 1: Season Premiere",
        startEpisode: 1,
        endEpisode: 12,
        description: "Episode 1 - 12: Pengenalan dan awal konflik."
      },
      {
        id: `${anime.id || "anime"}-arc-2`,
        title: "Cour 2: Climax & Resolution",
        startEpisode: 13,
        endEpisode: total,
        description: `Episode 13 - ${total}: Pertempuran puncak dan penyelesaian.`
      }
    ];
  }

  // Group into ~25 to 50 episode arcs for longer anime
  const chunkSize = total > 150 ? 50 : 25;
  const arcs: AnimeArc[] = [];
  let currentStart = 1;
  let arcIndex = 1;

  while (currentStart <= total) {
    const currentEnd = Math.min(currentStart + chunkSize - 1, total);
    arcs.push({
      id: `${anime.id || "anime"}-arc-${arcIndex}`,
      title: `Arc ${arcIndex} (Episode ${currentStart} - ${currentEnd})`,
      startEpisode: currentStart,
      endEpisode: currentEnd,
      description: `Kumpulan episode ${currentStart} sampai ${currentEnd} Subtitle Indonesia.`
    });
    currentStart = currentEnd + 1;
    arcIndex++;
  }

  return arcs;
}

// Helper to guarantee full episode list from 1 up to actual count (e.g. 1122 for One Piece)
export function ensureAnimeEpisodes(anime: Anime): Anime {
  const count =
    anime.episodesCount && anime.episodesCount > 0 ? anime.episodesCount : 12;
  const seasons = getAnimeSeasons(anime);
  const arcs = getAnimeArcs(anime);
  const existingEpisodes = anime.episodes || [];

  const fullEpisodes: Episode[] = [];
  for (let i = 1; i <= count; i++) {
    const existing = existingEpisodes.find((e) => e.number === i);
    const season = seasons.find((s) => i >= s.startEpisode && i <= s.endEpisode) || seasons[0];
    const arc = arcs.find((a) => i >= a.startEpisode && i <= a.endEpisode) || arcs[0];

    let epTitle = `Episode ${i}`;
    const slugLower = anime.slug ? anime.slug.toLowerCase() : "";
    if (slugLower.includes("one-piece") || anime.id === "13") {
      if (i === 1) epTitle = "Episode 1 - Aku Luffy! Pria yang Akan Menjadi Raja Bajak Laut!";
      else if (i === 1071) epTitle = "Episode 1071 - Puncak Kekuatan! Gear 5 Luffy!";
      else if (i === 1072) epTitle = "Episode 1072 - Kekuatan Ridiculous! Gear 5 vs Kaido!";
      else if (i === 1100) epTitle = "Episode 1100 - Pertarungan Sengit! Lucci vs Luffy Gear 5!";
      else if (i === 1122) epTitle = "Episode 1122 - Kebenaran Abad Kekosongan & Pesan Vegapunk!";
      else epTitle = `Episode ${i} - ${arc?.title || "Story Arc"}`;
    }

    if (existing) {
      fullEpisodes.push({
        ...existing,
        title: existing.title || epTitle,
        arcId: arc?.id,
        arcTitle: arc?.title,
        seasonNumber: season?.seasonNumber,
        seasonTitle: season?.title,
        thumbnail: existing.thumbnail || anime.banner || anime.poster,
        synopsis:
          existing.synopsis || `Episode ${i} dari serial anime ${anime.title}. Subtitle Indonesia HD.`,
      });
    } else {
      fullEpisodes.push({
        id: `${anime.id}-ep-${i}`,
        number: i,
        title: epTitle,
        arcId: arc?.id,
        arcTitle: arc?.title,
        seasonNumber: season?.seasonNumber,
        seasonTitle: season?.title,
        thumbnail: anime.banner || anime.poster,
        duration: "24m",
        isWatched: i <= 2,
        synopsis: `Episode ${i} dari serial ${anime.title} (${arc?.title || "Arc"}). Streaming gratis Sub Indo Full HD.`,
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      });
    }
  }

  return {
    ...anime,
    seasons,
    arcs,
    episodes: fullEpisodes,
  };
}

// 5. Get Anime by Slug or ID (Intelligent, Fuzzy, Never 404)
export async function getAnimeBySlug(slugParam: string): Promise<Anime> {
  const slug = decodeURIComponent(slugParam).trim().toLowerCase();

  // 1. Check exact match in local dataset
  const exactMatch = animeList.find(
    (a) => a.slug.toLowerCase() === slug || a.id === slug
  );
  if (exactMatch) return ensureAnimeEpisodes(exactMatch);

  // 2. Check partial / fuzzy slug or title in local dataset
  const cleanSearch = slug.replace(/[^a-z0-9]/g, " ");
  const fuzzyMatch = animeList.find((a) => {
    const aSlugClean = a.slug.replace(/[^a-z0-9]/g, " ");
    const aTitleClean = a.title.toLowerCase().replace(/[^a-z0-9]/g, " ");
    return (
      aSlugClean.includes(cleanSearch) ||
      cleanSearch.includes(aSlugClean) ||
      aTitleClean.includes(cleanSearch) ||
      cleanSearch.includes(aTitleClean)
    );
  });
  if (fuzzyMatch) return ensureAnimeEpisodes(fuzzyMatch);

  // 3. If slug starts with ID, try AniList by ID
  const id = getIdFromSlug(slug);
  if (id && !isNaN(Number(id))) {
    const anilistQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { english romaji native }
          coverImage { extraLarge large medium }
          bannerImage
          averageScore
          genres
          episodes
          description
          status
          season
          seasonYear
          format
          duration
          studios(isMain: true) { nodes { name } }
          trailer { id site }
        }
      }
    `;

    try {
      const res = await fetch(ANILIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: anilistQuery,
          variables: { id: Number(id) },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.Media) {
          return ensureAnimeEpisodes(mapAniListToAnime(json.data.Media));
        }
      }
    } catch (e) {}

    // Fallback to Jikan by ID
    const jikanData = await fetchJikan(`${JIKAN_BASE_URL}/anime/${id}/full`);
    if (jikanData) {
      return ensureAnimeEpisodes(mapJikanToAnime(jikanData));
    }
  }

  // 4. Try searching AniList by title
  const searchTitle = slug.replace(/^\d+-/, "").replace(/-/g, " ");
  const anilistSearchQuery = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title { english romaji native }
        coverImage { extraLarge large medium }
        bannerImage
        averageScore
        genres
        episodes
        description
        status
        season
        seasonYear
        format
        duration
        studios(isMain: true) { nodes { name } }
        trailer { id site }
      }
    }
  `;

  try {
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: anilistSearchQuery,
        variables: { search: searchTitle },
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.Media) {
        return ensureAnimeEpisodes(mapAniListToAnime(json.data.Media));
      }
    }
  } catch (e) {}

  // 5. Ultimate Fallback: Never return null or 404!
  const fallback = animeList[0];
  return ensureAnimeEpisodes({
    ...fallback,
    slug: slugParam,
    title:
      searchTitle
        ? searchTitle.charAt(0).toUpperCase() + searchTitle.slice(1)
        : fallback.title,
  });
}

// 6. Get Recommended Anime
export async function getRecommendations(animeId: string): Promise<Anime[]> {
  const anilistQuery = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        recommendations(perPage: 8, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id
              title { english romaji }
              coverImage { extraLarge large medium }
              bannerImage
              averageScore
              genres
              format
              status
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: anilistQuery, variables: { id: Number(animeId) } }),
    });
    if (res.ok) {
      const json = await res.json();
      const nodes = json?.data?.Media?.recommendations?.nodes;
      if (Array.isArray(nodes) && nodes.length > 0) {
        return nodes
          .filter((n: any) => n?.mediaRecommendation)
          .map((n: any) => mapAniListToAnime(n.mediaRecommendation));
      }
    }
  } catch (e) {}

  return animeList.filter((a) => a.id !== animeId).slice(0, 8);
}
