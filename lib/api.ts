import { Anime, Episode } from "@/types/anime";
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

// 5. Get Anime by Slug or ID (Intelligent, Fuzzy, Never 404)
export async function getAnimeBySlug(slugParam: string): Promise<Anime> {
  const slug = decodeURIComponent(slugParam).trim().toLowerCase();

  // 1. Check exact match in local dataset
  const exactMatch = animeList.find(
    (a) => a.slug.toLowerCase() === slug || a.id === slug
  );
  if (exactMatch) return exactMatch;

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
  if (fuzzyMatch) return fuzzyMatch;

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
          return mapAniListToAnime(json.data.Media);
        }
      }
    } catch (e) {}

    // Fallback to Jikan by ID
    const jikanData = await fetchJikan(`${JIKAN_BASE_URL}/anime/${id}/full`);
    if (jikanData) {
      return mapJikanToAnime(jikanData);
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
        return mapAniListToAnime(json.data.Media);
      }
    }
  } catch (e) {}

  // 5. Ultimate Fallback: Never return null or 404!
  const fallback = animeList[0];
  return {
    ...fallback,
    slug: slugParam,
    title:
      searchTitle
        ? searchTitle.charAt(0).toUpperCase() + searchTitle.slice(1)
        : fallback.title,
  };
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
