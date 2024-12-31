import { Suspense } from "react";
import { ReadThreadButton } from "./read-thread-button";
import { Skeleton } from "@/app/components/skeleton";

export function ThreadSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

function Thread({ thread }: { thread: any }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
        {thread.topic}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {thread.topComment}
      </p>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Replies: {thread.replyCount}
      </div>
      <ReadThreadButton threadId={thread.id} />
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
        {threads.map((thread, index) => (
          <Suspense key={index} fallback={<ThreadSkeleton />}>
            <Thread thread={thread} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
