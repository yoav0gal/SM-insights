"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import { Skeleton } from "@/app/components/skeleton";
import { searchComments } from "./search-comments-actions";
import { Comment } from "../recommended-comments/comment";

export function CommentSearch({ videoId }: { videoId: string }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TransformedComment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const results = await searchComments(videoId, query);

    setSearchResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Search Comments
      </h3>
      <form onSubmit={handleSearch} className="relative mb-4">
        <input
          type="text"
          placeholder="Search comments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      {loading ? (
        <Skeleton className="w-max" />
      ) : (
        <div className="space-y-4">
          {searchResults.map((comment, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
            >
              <Comment comment={comment} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
