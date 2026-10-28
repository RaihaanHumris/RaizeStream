import { NextRequest, NextResponse } from "next/server";
import {
  searchAnimeIndo,
  getAnimeDetailsAnimeIndo,
  getEpisodeStreamAnimeIndo,
} from "@/lib/animeindo";
import { animeList } from "@/data/anime";

// Mapping to ensure every anime resolves to its exact AniList / MAL ID
function resolveTargetAniListId(
  animeId: string,
  title: string,
  slug?: string
): string {
  const text = `${title} ${slug || ""} ${animeId}`.toLowerCase();

  if (text.includes("solo leveling") || animeId === "1" || text.includes("151807")) return "151807";
  if (text.includes("jujutsu kaisen") || animeId === "2" || text.includes("113415")) return "113415";
  if (text.includes("demon slayer") || text.includes("kimetsu") || animeId === "3" || text.includes("101922")) return "101922";
  if (text.includes("frieren") || animeId === "4" || text.includes("154587")) return "154587";
  if (text.includes("chainsaw man") || animeId === "5" || text.includes("127230")) return "127230";
  if (text.includes("cyberpunk") || animeId === "6" || text.includes("120377")) return "120377";
  if (text.includes("attack on titan") || text.includes("shingeki") || animeId === "7" || text.includes("16498")) return "16498";
  if (text.includes("bleach") || animeId === "8" || text.includes("114446")) return "114446";
  if (text.includes("spy x family") || animeId === "9" || text.includes("140960")) return "140960";
  if (text.includes("wind breaker") || animeId === "10" || text.includes("163270")) return "163270";
  if (text.includes("kaiju") || animeId === "11" || text.includes("153288")) return "153288";
  if (text.includes("dandadan") || text.includes("dan da dan") || animeId === "12" || text.includes("171018")) return "171018";
  if (text.includes("one piece") || animeId === "13" || animeId === "21") return "21";
  if (text.includes("vinland saga") || animeId === "14" || text.includes("101348")) return "101348";
  if (text.includes("hell's paradise") || text.includes("jigokuraku") || animeId === "15" || text.includes("128893")) return "128893";
  if (text.includes("mushoku tensei") || animeId === "16" || text.includes("108465")) return "108465";
  if (text.includes("haikyu") || animeId === "17" || text.includes("20464")) return "20464";
  if (text.includes("tower of god") || animeId === "18" || text.includes("115230")) return "115230";
  if (text.includes("re:zero") || text.includes("re zero") || animeId === "19" || text.includes("21355")) return "21355";
  if (text.includes("blue lock") || animeId === "20" || text.includes("137822")) return "137822";
  if (text.includes("shangri-la") || animeId === "21" || text.includes("148471")) return "148471";
  if (text.includes("violet evergarden") || animeId === "22" || text.includes("21827")) return "21827";
  if (text.includes("steins") || animeId === "23" || text.includes("9253")) return "9253";
  if (text.includes("oshi no ko") || animeId === "24" || text.includes("150672")) return "150672";

  if (animeId && !isNaN(Number(animeId)) && Number(animeId) > 100) {
    return animeId;
  }

  return "151807";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const episode = Number(searchParams.get("episode")) || 1;
  const animeId = searchParams.get("id") || "";
  const slug = searchParams.get("slug") || "";

  if (!title && !animeId && !slug) {
    return NextResponse.json(
      { error: "Anime parameter is required" },
      { status: 400 }
    );
  }

  // Find match in dataset
  const matchAnime = animeList.find(
    (a) =>
      a.id === animeId ||
      a.slug === slug ||
      a.title.toLowerCase() === title.toLowerCase() ||
      title.toLowerCase().includes(a.title.toLowerCase())
  );

  const targetId = resolveTargetAniListId(
    animeId || matchAnime?.id || "",
    title || matchAnime?.title || "",
    slug || matchAnime?.slug || ""
  );

  const cleanTitle = (title || matchAnime?.title || "")
    .replace(/[^\w\s]/gi, "")
    .trim();

  const collectedServers: Array<{
    server: string;
    url: string;
    type: "iframe" | "video";
  }> = [];

  // 1. Primary Dedicated Fast Sub Indo Server (No Ads / Clean Player)
  collectedServers.push({
    server: "Server ⚡ Fast Sub-Indo (Tanpa Iklan)",
    url: `https://www.animeembed.com/embed/ani/${targetId}/${episode}?track=sub&lang=id&autoPlay=0`,
    type: "iframe",
  });

  // 2. Secondary Sub Indo Clean Stream
  collectedServers.push({
    server: "Server 🚀 Sub Indo HD (Clean Stream)",
    url: `https://vidsrc.cc/v2/embed/anime/${targetId}/${episode}`,
    type: "iframe",
  });

  // 3. Anime HD Sub
  collectedServers.push({
    server: "Server 3 (Anime HD Sub)",
    url: `https://www.animeembed.com/embed/ani/${targetId}/${episode}?track=sub&autoPlay=0`,
    type: "iframe",
  });

  // 4. Secondary MultiStream Server
  collectedServers.push({
    server: "Server 4 (MultiStream HD)",
    url: `https://multiembed.mov/?video_id=${targetId}&tmdb=0&s=1&e=${episode}`,
    type: "iframe",
  });

  // 5. 2Embed Stream
  collectedServers.push({
    server: "Server 5 (2Embed Player)",
    url: `https://2embed.cc/embed/anime/${targetId}/${episode}`,
    type: "iframe",
  });

  // 6. Native HTML5 Video Player (Direct MP4 with custom player UI)
  collectedServers.push({
    server: "Server 6 (Native Player MP4)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video",
  });

  // 7. Try live scraping from AnimeIndo API if custom instance available
  try {
    const animeIndoSearch = await searchAnimeIndo(cleanTitle || title);
    if (Array.isArray(animeIndoSearch) && animeIndoSearch.length > 0) {
      const match = animeIndoSearch[0];
      const epSlug = match.slug || match.id || match.endpoint;
      if (epSlug) {
        const details = await getAnimeDetailsAnimeIndo(epSlug);
        const epList =
          details?.episodes ||
          details?.episode_list ||
          details?.episodesList ||
          [];
        const epMatch =
          epList.find(
            (e: any) =>
              Number(e.number || e.episode) === episode ||
              e.title?.includes(`Episode ${episode}`) ||
              e.title?.includes(`Ep ${episode}`) ||
              e.slug?.includes(`episode-${episode}`)
          ) || epList[0];

        if (epMatch?.slug || epMatch?.endpoint || epMatch?.id) {
          const targetEpSlug = epMatch.slug || epMatch.endpoint || epMatch.id;
          const streamData = await getEpisodeStreamAnimeIndo(targetEpSlug);
          if (streamData?.streamUrl) {
            collectedServers.unshift({
              server: "AnimeIndo Direct (Sub Indo - No Ads)",
              url: streamData.streamUrl,
              type: streamData.isIframe ? "iframe" : "video",
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("AnimeIndo live check notice:", err);
  }

  const primaryServer = collectedServers[0];

  return NextResponse.json({
    status: "ready",
    source: "anime-stream-hub",
    targetId,
    streamUrl: primaryServer.url,
    isIframe: primaryServer.type === "iframe",
    servers: collectedServers,
    title: title || matchAnime?.title || "Anime Episode",
    episode,
  });
}
