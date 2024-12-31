import { Suspense } from "react";
import { VideoDetailsComponent } from "./video-details";
import { RecommendedComments } from "./recommended-comments";
import { NoticeableThreads } from "./noticeable-threads";
import { KeyTakeaways } from "./key-takeaways";
import { CommentClusters } from "./comments-clusters/comments-cluster";
import { CommentSearch } from "./comments-search/comments-search";
import { Skeleton } from "@/app/components/skeleton";

import { getVideoComments } from "@/app/api/youtube/comments/actions";
import { fetchVideoDetails } from "@/app/api/youtube/video-details/actions";
import { Header } from "@/app/components/header";

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-5/6" />
    </div>
  );
}

export default async function YouTubeAnalyzePage({
  params,
}: {
  params: Promise<{ video_id: string }>;
}) {
  const videoId = (await params)?.video_id;
  // In a real application, you would fetch the data here based on the video_id
  const [videoDetails, commentsObj] = await Promise.all([
    fetchVideoDetails(videoId),
    getVideoComments(videoId),
  ]);

  const comments = commentsObj.comments;

  const recommendedThreds = comments
    .sort((a, b) => b.replies.length - a.replies.length)
    .slice(0, 3);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-purple-600 dark:text-purple-400">
            YouTube Video Analysis
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Suspense fallback={<SectionSkeleton />}>
                <VideoDetailsComponent details={videoDetails} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <RecommendedComments initialComments={comments.slice(0, 3)} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <NoticeableThreads threads={recommendedThreds} />
              </Suspense>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Suspense fallback={<SectionSkeleton />}>
                <KeyTakeaways />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <CommentClusters />
              </Suspense>
              <CommentSearch />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
