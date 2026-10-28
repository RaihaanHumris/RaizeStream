/**
 * AnimeIndo REST API Client
 * Built for repositories under GitHub topic: animeindo-api
 * Examples:
 * - MastayY/kumanime-api (https://github.com/MastayY/kumanime-api)
 * - LuckyIndraEfendi/AnimeIndo-RestAPI-V2 (https://github.com/LuckyIndraEfendi/AnimeIndo-RestAPI-V2)
 * Supports anime search, details, episode scraping, and streaming links.
 */

const ANIMEINDO_BASE_URL =
  process.env.ANIMEINDO_API_URL ||
  process.env.NEXT_PUBLIC_ANIMEINDO_API_URL ||
  "https://kumanime-api.vercel.app";

export interface AnimeIndoStreamServer {
  server: string;
  url: string;
  type?: "iframe" | "video";
}

export interface AnimeIndoStreamResult {
  streamUrl: string;
  isIframe: boolean;
  servers: AnimeIndoStreamServer[];
  title?: string;
  episode?: number;
  provider?: string;
}

// 1. Search Anime from AnimeIndo API
export async function searchAnimeIndo(query: string, customBaseUrl?: string) {
  const baseUrl = (customBaseUrl || ANIMEINDO_BASE_URL).replace(/\/$/, "");
  const cleanQuery = encodeURIComponent(query.trim());

  // Support typical AnimeIndo API routes across various community implementations
  const endpoints = [
    `${baseUrl}/api/search/${cleanQuery}`,
    `${baseUrl}/search/${cleanQuery}`,
    `${baseUrl}/luckyanime?search=${cleanQuery}`,
    `${baseUrl}/api/v1/search?q=${cleanQuery}`,
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json?.results || json?.anime || json;
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  return null;
}

// 2. Get Anime Details & Episode List from AnimeIndo API
export async function getAnimeDetailsAnimeIndo(
  slug: string,
  customBaseUrl?: string
) {
  const baseUrl = (customBaseUrl || ANIMEINDO_BASE_URL).replace(/\/$/, "");
  const cleanSlug = encodeURIComponent(slug.trim());

  const endpoints = [
    `${baseUrl}/api/anime/${cleanSlug}`,
    `${baseUrl}/anime/${cleanSlug}`,
    `${baseUrl}/luckyanime/detail/${cleanSlug}`,
    `${baseUrl}/api/v1/anime/${cleanSlug}`,
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        if (data && (data.episodes || data.episode_list || data.episodesList)) {
          return data;
        }
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  return null;
}

// 3. Get Episode Streaming Links from AnimeIndo API
export async function getEpisodeStreamAnimeIndo(
  episodeSlug: string,
  customBaseUrl?: string
): Promise<AnimeIndoStreamResult | null> {
  const baseUrl = (customBaseUrl || ANIMEINDO_BASE_URL).replace(/\/$/, "");
  const cleanSlug = encodeURIComponent(episodeSlug.trim());

  const endpoints = [
    `${baseUrl}/api/episode/${cleanSlug}`,
    `${baseUrl}/episode/${cleanSlug}`,
    `${baseUrl}/watch/${cleanSlug}`,
    `${baseUrl}/luckyanime/watch/${cleanSlug}`,
    `${baseUrl}/api/v1/episode/${cleanSlug}`,
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        if (!data) continue;

        const streamUrl =
          data.stream_url ||
          data.video_url ||
          data.streamUrl ||
          data.url ||
          data.link ||
          data.stream_servers?.[0]?.url ||
          data.streamServers?.[0]?.url ||
          data.servers?.[0]?.url ||
          "";

        const servers: AnimeIndoStreamServer[] = [];

        // Parse stream_servers
        if (Array.isArray(data.stream_servers)) {
          data.stream_servers.forEach((s: any) => {
            if (s?.url) {
              servers.push({
                server: s.server || s.name || "AnimeIndo Server",
                url: s.url,
                type:
                  s.url.includes("embed") ||
                  s.url.includes("player") ||
                  s.url.includes(".html")
                    ? "iframe"
                    : "video",
              });
            }
          });
        } else if (Array.isArray(data.servers)) {
          data.servers.forEach((s: any) => {
            if (s?.url) {
              servers.push({
                server: s.name || s.server || "AnimeIndo Server",
                url: s.url,
                type:
                  s.url.includes("embed") ||
                  s.url.includes("player") ||
                  s.url.includes(".html")
                    ? "iframe"
                    : "video",
              });
            }
          });
        }

        if (streamUrl && servers.length === 0) {
          const isEmbed =
            streamUrl.includes("embed") ||
            streamUrl.includes("player") ||
            streamUrl.includes(".html");
          servers.push({
            server: "AnimeIndo Stream (HD)",
            url: streamUrl,
            type: isEmbed ? "iframe" : "video",
          });
        }

        if (servers.length > 0 || streamUrl) {
          const mainUrl = streamUrl || servers[0]?.url;
          return {
            streamUrl: mainUrl,
            isIframe:
              mainUrl.includes("embed") ||
              mainUrl.includes("player") ||
              mainUrl.includes(".html"),
            servers,
            title: data.title,
            episode: data.episode ? Number(data.episode) : undefined,
            provider: "AnimeIndo API",
          };
        }
      }
    } catch {
      // Continue to next endpoint attempt
    }
  }

  return null;
}
