"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import Image from "next/image";
import { Skeleton } from "@/app/components/skeleton";

export function CommentSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TransformedComment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real application, you would fetch search results from an API
    const mockResults: TransformedComment[] = [
      {
        displayText: `This comment contains the search term "${query}". It's a great example!`,
        authorDisplayName: "Search User 1",
        authorProfileImageUrl:
          "https://randomuser.me/api/portraits/women/3.jpg",
        authorChannelUrl: "https://www.youtube.com/channel/UC1122334455",
        likeCount: 15,
        updatedAt: new Date().toISOString(),
        totalReplyCount: 2,
        replies: [],
      },
      {
        displayText: `Another comment matching "${query}". This shows how the search works.`,
        authorDisplayName: "Search User 2",
        authorProfileImageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
        authorChannelUrl: "https://www.youtube.com/channel/UC5544332211",
        likeCount: 8,
        updatedAt: new Date().toISOString(),
        totalReplyCount: 1,
        replies: [],
      },
    ];
    setSearchResults(mockResults);
    setLoading(false);
  };

  //   return <h1>Comment Search</h1>;
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
              <div className="flex items-start space-x-3">
                <Image
                  src={comment.authorProfileImageUrl}
                  width={40}
                  height={40}
                  alt={comment.authorDisplayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {comment.authorDisplayName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {comment.displayText}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Likes: {comment.likeCount} | Replies:{" "}
                    {comment.totalReplyCount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
