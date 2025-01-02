import { Suspense } from "react";
import {} from "./read-thread-button";
import { Skeleton } from "@/app/components/skeleton";
import { TransformedComment } from "@/app/api/youtube/comments/actions";
import { Thread } from "./thread";

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

export async function NoticeableThreads({ threads }: { threads: any[] }) {
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
