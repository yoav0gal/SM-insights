"use client";

import { useState } from "react";
import { CommentSkeleton } from "./recommended-comments";

export function RecommendMoreButton() {
  const [loading, setLoading] = useState(false);

  const handleRecommendMore = async () => {
    setLoading(true);
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In a real application, you would fetch new comments from an API and update the state
    setLoading(false);
  };

  return (
    <button
      onClick={handleRecommendMore}
      className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
      disabled={loading}
    >
      {loading ? <CommentSkeleton /> : "Recommend More"}
    </button>
  );
}
