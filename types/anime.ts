export interface AnimeSeason {
  id: string;
  seasonNumber: number;
  title: string;
  startEpisode: number;
  endEpisode: number;
  year?: number;
  episodesCount?: number;
  description?: string;
}

export interface AnimeArc {
  id: string;
  title: string;
  startEpisode: number;
  endEpisode: number;
  description?: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  isWatched?: boolean;
  progress?: number; // 0 - 100
  videoUrl?: string;
  synopsis?: string;
  arcId?: string;
  arcTitle?: string;
  seasonNumber?: number;
  seasonTitle?: string;
}

export interface Anime {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  poster: string;
  banner: string;
  rating: number; // e.g. 8.9
  genres: string[];
  episodesCount: number;
  synopsis: string;
  status: "Airing" | "Completed" | "Upcoming";
  season: string;
  year: number;
  studio: string;
  type: "TV" | "Movie" | "OVA";
  duration: string;
  rank?: number;
  featured?: boolean;
  isTrending?: boolean;
  isNewEpisode?: boolean;
  isPopularSeason?: boolean;
  isTopRated?: boolean;
  continueProgress?: {
    episodeNumber: number;
    episodeTitle: string;
    progressPercentage: number;
    timestamp: string;
    totalTime: string;
  };
  seasons?: AnimeSeason[];
  arcs?: AnimeArc[];
  episodes: Episode[];
  trailerUrl?: string;
}

export type Genre =
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Drama"
  | "Fantasy"
  | "Sci-Fi"
  | "Supernatural"
  | "Mystery"
  | "Romance"
  | "Thriller"
  | "Horror"
  | "Slice of Life";
