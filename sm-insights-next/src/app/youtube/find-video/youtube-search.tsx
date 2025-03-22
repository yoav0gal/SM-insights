"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Youtube, Search } from "lucide-react";

export function YouTubeSearch() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    if (videoId) {
      const format = url.includes("/shorts/") ? "short" : "classic";
      router.push(`/youtube/analyze/${videoId}?format=${format}`);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const extractVideoId = (url: string): string | null => {
    const classicMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (classicMatch) return classicMatch[1];

    const shortMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch) return youtuBeMatch[1];

    return null;
  };

  return (
    <div className="text-center w-full">
      <div className="flex items-center justify-center mb-4">
        <MessageCircle className="h-10 w-10 text-purple-600 dark:text-purple-400 mr-2" />
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">
          AudieLens
        </h1>
        <Youtube className="h-10 w-10 text-red-600 dark:text-red-400 ml-2" />
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        YouTube Analyzer
      </h2>
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube/YouTube Short valid URL"
            className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
