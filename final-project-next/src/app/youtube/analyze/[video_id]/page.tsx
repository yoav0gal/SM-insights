import { Suspense } from "react";
import { VideoDetailsComponent } from "./video-details/video-details";
import { RecommendedComments } from "./recommended-comments/recommended-comments-wrapper";
import { NoticeableThreads } from "./noticeable-threads/noticeable-threads";
import { KeyTakeaways } from "./key-takeaways/key-takeaways";
import { CommentSearch } from "./comments-search/comments-search";
import { CommentQuestions } from "./comments-questions/comments-questions";
import { CommentsClustersCard } from "./comments-clusters/comments-cluster-card";
import { Header } from "@/app/components/header";

export default async function YouTubeAnalyzePage({
  params,
}: {
  params: Promise<{ video_id: string }>;
}) {
  const videoId = (await params)?.video_id;

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
              <Suspense fallback={<VideoDetailsComponent.Skeleton />}>
                <VideoDetailsComponent videoId={videoId} />
              </Suspense>
              <Suspense fallback={<RecommendedComments.Skeleton />}>
                <RecommendedComments videoId={videoId} />
              </Suspense>
              {/* <Suspense fallback={<NoticeableThreads.Skeleton />}>
                <NoticeableThreads videoId={videoId} />
              </Suspense> */}
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Suspense fallback={<KeyTakeaways.Skeletone />}>
                <KeyTakeaways videoId={videoId} />
              </Suspense>
              <Suspense fallback={<CommentsClustersCard.Skeleton />}>
                <CommentsClustersCard videoId={videoId} />
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
