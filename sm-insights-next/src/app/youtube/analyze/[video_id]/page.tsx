import { Suspense } from "react";
import { VideoDetailsComponent } from "./video-details";
import { RecommendedComments } from "./recommended-comments/recommended-comments";
import { NoticeableThreads } from "./noticeable-threads/noticeable-threads";
import { KeyTakeaways } from "./key-takeaways/key-takeaways";
import { CommentClusters } from "./comments-clusters/comments-cluster";
import { CommentSearch } from "./comments-search/comments-search";
import { Skeleton } from "@/app/components/skeleton";
import { CommentQuestions } from "./comments-questions/comments-questions";
import { getVideoComments } from "@/app/api/youtube/comments/actions";
import { fetchVideoDetails } from "@/app/api/youtube/video-details/actions";
import { Header } from "@/app/components/header";
import { getModel } from "./analysis";
import { DEFAULT_CREATOR_ID } from "./youtube-analysis-constants";

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

  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const [recommendations, noticeableThreads, clustering, videoDetails] =
    await Promise.all([
      model.recommendations(),
      model.noticeableThreads(),
      model.clusterBig(),
      fetchVideoDetails(videoId),
    ]);

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
                <RecommendedComments
                  initialComments={recommendations}
                  videoId={videoId}
                />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <NoticeableThreads threads={noticeableThreads} />
              </Suspense>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Suspense fallback={<SectionSkeleton />}>
                <KeyTakeaways videoId={videoId} />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <CommentClusters initialData={clustering} videoId={videoId} />
              </Suspense>
              <CommentSearch videoId={videoId} />
              <CommentQuestions videoId={videoId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
