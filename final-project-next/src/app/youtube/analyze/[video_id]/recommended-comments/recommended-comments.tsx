"use client";
import { Suspense } from "react";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import { Skeleton } from "@/app/components/skeleton";
import { Comment } from "./comment";
import { useState } from "react";
import { recommendComments } from "./recommend-comments-actions";
export function CommentSkeleton() {
  return (
    <div className="flex items-start space-x-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function RecommendedCommentsList({
  videoId,
  initialComments,
}: {
  videoId: string;
  initialComments: TransformedComment[];
}) {
  const [recommendedComments, setRecommendedComments] =
    useState(initialComments);
  const [loading, setLoading] = useState(false);

  const handleRecommendMore = async () => {
    setLoading(true);
    const newRecommendedComment = await recommendComments(videoId);
    setRecommendedComments(newRecommendedComment);
    setLoading(false);
  };

  return (
    <>
      <div className="space-y-4">
        {recommendedComments.map((comment, index) => (
          <Suspense key={index} fallback={<CommentSkeleton />}>
            <Comment comment={comment} />
          </Suspense>
        ))}
      </div>
      <button
        onClick={handleRecommendMore}
        className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
        disabled={loading}
      >
        {loading ? <CommentSkeleton /> : "Recommend More"}
      </button>
    </>
  );
}
