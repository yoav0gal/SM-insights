import { CommentSkeleton } from "./recommended-comments";
import { recommendComments } from "./recommend-comments-actions";
import { Skeleton } from "@/app/components/skeleton";
import { RecommendedCommentsList } from "./recommended-comments";

export async function RecommendedComments({ videoId }: { videoId: string }) {
  const comments = await recommendComments(videoId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Recommended Comments
      </h3>
      <RecommendedCommentsList initialComments={comments} videoId={videoId} />
    </div>
  );
}

RecommendedComments.Skeleton = function RecommendedCommentsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <div className="space-y-4">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    </div>
  );
};
