"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Subtitles,
  ChevronLeft,
  ChevronRight,
  Server,
  Loader2,
  Tv,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface ServerOption {
  server: string;
  url: string;
  type?: "iframe" | "video";
}

interface VideoPlayerProps {
  title: string;
  episodeNumber: number;
  animeId?: string;
  videoUrl?: string;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function VideoPlayer({
  title,
  episodeNumber,
  animeId,
  videoUrl: defaultUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  hasPrev = false,
  hasNext = true,
  onPrev,
  onNext,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeUrl, setActiveUrl] = useState(defaultUrl);
  const [isIframe, setIsIframe] = useState(false);
  const [servers, setServers] = useState<ServerOption[]>([
    {
      server: "Aniyoi Stream (Sub Indo)",
      url: `https://vidsrc.to/embed/anime/${animeId || "52299"}/${episodeNumber}`,
      type: "iframe",
    },
    {
      server: "MultiStream HD",
      url: `https://multiembed.mov/?video_id=${animeId || "52299"}&tmdb=0&s=1&e=${episodeNumber}`,
      type: "iframe",
    },
    {
      server: "Backup Direct (MP4)",
      url: defaultUrl,
      type: "video",
    },
  ]);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [loadingStream, setLoadingStream] = useState(false);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  // Fetch stream from stream resolver on mount or episode change
  useEffect(() => {
    async function loadStream() {
      setLoadingStream(true);
      try {
        const res = await fetch(
          `/api/stream?title=${encodeURIComponent(title)}&episode=${episodeNumber}&id=${animeId || ""}`
        );
        const data = await res.json();

        if (data?.streamUrl) {
          setActiveUrl(data.streamUrl);
          setIsIframe(data.isIframe ?? data.streamUrl.includes("embed"));
          if (Array.isArray(data.servers) && data.servers.length > 0) {
            setServers(data.servers);
          }
        }
      } catch (err) {
        console.warn("Could not load from stream route, using default.");
      } finally {
        setLoadingStream(false);
      }
    }

    loadStream();
  }, [title, episodeNumber, animeId]);

  const switchServer = (index: number) => {
    setSelectedServerIndex(index);
    const chosen = servers[index];
    if (chosen) {
      setActiveUrl(chosen.url);
      setIsIframe(
        chosen.type === "iframe" ||
          chosen.url.includes("embed") ||
          chosen.url.includes("mov") ||
          chosen.url.includes("player")
      );
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setProgress((curr / dur) * 100);
    setCurrentTime(formatTime(curr));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    videoRef.current.currentTime = newProgress * videoRef.current.duration;
    setProgress(newProgress * 100);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Streaming Server Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-md bg-deep-navy border border-outline text-xs">
        <div className="flex items-center gap-2 text-white font-poppins font-semibold">
          <Server className="w-4 h-4 text-electric-purple" />
          <span>Server Streaming:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {servers.map((srv, idx) => (
            <button
              key={idx}
              onClick={() => switchServer(idx)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                selectedServerIndex === idx
                  ? "bg-gradient-brand text-white shadow-glow-purple font-semibold"
                  : "bg-slate-night/80 border border-outline text-soft-gray hover:text-white hover:border-electric-purple"
              }`}
            >
              {srv.server}
            </button>
          ))}
        </div>
      </div>

      {/* 16:9 Video Container with Radius 16px */}
      <div
        ref={containerRef}
        onMouseMove={() => setShowControls(true)}
        className="group relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-outline shadow-2xl flex items-center justify-center select-none"
      >
        {/* Loading Spinner */}
        {loadingStream && (
          <div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-electric-purple animate-spin" />
            <span className="text-xs text-soft-gray font-poppins">
              Menghubungkan ke Stream Anime...
            </span>
          </div>
        )}

        {isIframe ? (
          /* Iframe Player for Embedded Streams */
          <div className="relative w-full h-full">
            <iframe
              key={activeUrl}
              src={activeUrl}
              title={`${title} Episode ${episodeNumber}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          /* Native HTML5 Video Player */
          <>
            <video
              ref={videoRef}
              src={activeUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Big Center Play/Pause button on idle */}
            {!isPlaying && !loadingStream && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-purple transition-transform hover:scale-110 active:scale-95"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-1" />
              </button>
            )}

            {/* Subtitle simulation indicator */}
            {subtitlesEnabled && isPlaying && (
              <div className="absolute bottom-16 sm:bottom-20 z-20 px-4 py-1.5 rounded-sm bg-black/75 text-white text-xs sm:text-sm font-medium tracking-wide">
                [Subtitle Indonesia • Stream Aktif]
              </div>
            )}

            {/* Player Overlays & Controls */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 flex flex-col justify-between p-3 sm:p-5 transition-opacity duration-300 z-30 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top Bar: Title & Quality Badge */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm font-poppins">
                <span className="font-semibold truncate max-w-md">
                  {title} — Episode {episodeNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-electric-purple/30 border border-electric-purple text-xs text-electric-purple font-mono font-semibold">
                  {quality}
                </span>
              </div>

              {/* Bottom Bar: Progress & Controls */}
              <div className="space-y-2.5">
                {/* Scrubber Progress Bar */}
                <div
                  onClick={handleSeek}
                  className="relative w-full h-2 rounded-full bg-white/20 cursor-pointer group/bar flex items-center"
                >
                  <div
                    className="h-full rounded-full bg-electric-purple shadow-glow-purple relative transition-all"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white">
                  {/* Left Controls */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="hover:text-electric-purple transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime -= 10;
                      }}
                      title="Rewind 10s"
                      className="text-soft-gray hover:text-white transition-colors hidden sm:block"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime += 10;
                      }}
                      title="Forward 10s"
                      className="text-soft-gray hover:text-white transition-colors hidden sm:block"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Volume slider */}
                    <div className="flex items-center gap-2 group/vol">
                      <button onClick={toggleMute} aria-label="Toggle Mute">
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-neon-pink" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-soft-gray hover:text-white" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-14 sm:w-20 h-1 bg-white/30 rounded-lg accent-electric-purple cursor-pointer"
                      />
                    </div>

                    {/* Time Display */}
                    <span className="text-xs text-soft-gray font-mono">
                      {currentTime} / {duration}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-3 sm:gap-4 text-soft-gray">
                    <button
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      title="Subtitles"
                      className={`hover:text-white transition-colors ${
                        subtitlesEnabled ? "text-electric-purple" : "text-muted"
                      }`}
                    >
                      <Subtitles className="w-5 h-5" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen"
                      className="hover:text-white transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Helper Bar if Stream Needs Alternative */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-soft-gray">
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-electric-purple" />
          Jika player loading lama atau diblokir adblocker, klik tombol tab server lain di atas.
        </span>

        {isIframe && activeUrl && (
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-purple hover:text-neon-pink flex items-center gap-1 transition-colors underline font-medium"
          >
            Buka Player di Tab Baru <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Episode Navigation Buttons Beneath Player */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`h-10 px-4 rounded-md border flex items-center gap-2 font-poppins text-xs font-medium transition-all ${
            hasPrev
              ? "glass-panel border-outline text-white hover:border-electric-purple hover:bg-slate-night"
              : "border-outline/40 text-muted cursor-not-allowed opacity-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Episode Sebelumnya
        </button>

        <span className="text-xs text-soft-gray font-inter flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-electric-purple" />
          Episode {episodeNumber}
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`h-10 px-4 rounded-md border flex items-center gap-2 font-poppins text-xs font-medium transition-all ${
            hasNext
              ? "bg-gradient-brand text-white border-transparent shadow-glow-purple hover:scale-102"
              : "border-outline/40 text-muted cursor-not-allowed opacity-50"
          }`}
        >
          Episode Berikutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
