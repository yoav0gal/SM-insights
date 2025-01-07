import { Suspense } from "react";
import { Skeleton } from "@/app/components/skeleton";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import { Thread } from "./thread";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";

export type Thread = {
  comment: TransformedComment;
  summary: string;
  topic: string;
  totalReplyCount: number;
};

export function ThreadSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export async function NoticeableThreads({ videoId }: { videoId: string }) {
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const threads = await model.noticeableThreads();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Noticeable Threads
      </h3>
      <div className="space-y-4">
        {threads.length === 0 && <h4>no threads found </h4>}
        {threads.map((thread, index) => (
          <Suspense key={index} fallback={<ThreadSkeleton />}>
            <Thread thread={thread} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

NoticeableThreads.Skeleton = function NoticeableThreadsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <div className="space-y-8">
        <ThreadSkeleton />
        <ThreadSkeleton />
        <ThreadSkeleton />
      </div>
    </div>
  );
};
