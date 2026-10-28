/**
 * Aniyoi API Client
 * GitHub: https://github.com/miukyo/aniyoi-api
 * REST API for Indonesian Subtitle Anime Streaming
 */

const ANIYOI_BASE_URL =
  process.env.ANIYOI_API_URL || "https://aniyoi-api.vercel.app";

export interface AniyoiStreamServer {
  server: string;
  url: string;
  type?: "iframe" | "video";
}

export interface AniyoiStreamResult {
  streamUrl: string;
  isIframe: boolean;
  servers: AniyoiStreamServer[];
  title?: string;
  episode?: number;
}

// 1. Search anime on aniyoi-api
export async function searchAniyoi(query: string, source = "kuronime") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `${ANIYOI_BASE_URL}/${source}/search/${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json;
  } catch (err) {
    console.warn("Aniyoi search failed:", err);
    return null;
  }
}

// 2. Get anime details & episode list from aniyoi-api
export async function getAnimeDetailsAniyoi(slug: string, source = "kuronime") {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${ANIYOI_BASE_URL}/${source}/anime/${slug}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json;
  } catch (err) {
    console.warn("Aniyoi anime details failed:", err);
    return null;
  }
}

// 3. Get streaming link for an episode from aniyoi-api
export async function getStreamingUrlAniyoi(
  episodeSlug: string,
  source = "kuronime"
): Promise<AniyoiStreamResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `${ANIYOI_BASE_URL}/${source}/watch/${encodeURIComponent(episodeSlug)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data || json;

    if (!data) return null;

    // Check if stream_url or video link exists
    const streamUrl =
      data.stream_url ||
      data.video_url ||
      data.url ||
      data.streamServers?.[0]?.url ||
      data.stream_servers?.[0]?.url ||
      "";

    const isIframe =
      streamUrl.includes("embed") ||
      streamUrl.includes("player") ||
      streamUrl.includes("blogger.com") ||
      streamUrl.includes("youtube.com") ||
      streamUrl.endsWith(".html");

    const servers: AniyoiStreamServer[] = [];

    if (Array.isArray(data.stream_servers)) {
      data.stream_servers.forEach((s: any) => {
        servers.push({
          server: s.server || s.name || "Aniyoi Server",
          url: s.url,
          type: s.url?.includes("embed") ? "iframe" : "video",
        });
      });
    } else if (streamUrl) {
      servers.push({
        server: "Aniyoi Primary",
        url: streamUrl,
        type: isIframe ? "iframe" : "video",
      });
    }

    return {
      streamUrl,
      isIframe,
      servers,
      title: data.title,
      episode: data.episode,
    };
  } catch (err) {
    console.warn("Aniyoi streaming URL fetch failed:", err);
    return null;
  }
}
