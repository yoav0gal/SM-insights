import { Suspense } from "react";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import Image from "next/image";
import { RecommendMoreButton } from "./recommend-more-button";
import { Skeleton } from "@/app/components/skeleton";

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

function Comment({ comment }: { comment: TransformedComment }) {
  return (
    <div className="flex items-start space-x-3">
      <Image
        src={comment.authorProfileImageUrl}
        alt={comment.authorDisplayName}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          {comment.authorDisplayName}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {comment.displayText}
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Likes: {comment.likeCount} | Replies: {comment.totalReplyCount}
        </div>
      </div>
    </div>
  );
}

export async function RecommendedComments({
  initialComments,
}: {
  initialComments: TransformedComment[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Recommended Comments
      </h3>
      <div className="space-y-4">
        {initialComments.map((comment, index) => (
          <Suspense key={index} fallback={<CommentSkeleton />}>
            <Comment comment={comment} />
          </Suspense>
        ))}
      </div>
      <RecommendMoreButton />
    </div>
  );
}
