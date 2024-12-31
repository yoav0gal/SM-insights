"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { RecommendedComments } from "./recommended-comments";
import { searchComments } from "./search-comments";
import { Comment } from "./comment-list";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search comments or ask a question..."
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
      </div>
    </form>
  );
}

export function SearchBarWrapper({ comments }: { comments: Comment[] }) {
  const [recommendedComments, setRecommendedComments] = useState<Comment[]>([]);

  const handleSearch = async (query: string) => {
    const results = await searchComments(comments, query);
    setRecommendedComments(results);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {recommendedComments.length > 0 && (
        <RecommendedComments comments={recommendedComments} />
      )}
    </>
  );
}
