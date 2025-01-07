import { Skeleton } from "@/app/components/skeleton";
import { CommentClusters } from "./comments-cluster";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
import { Suspense } from "react";

export async function CommentsClustersCard({ videoId }: { videoId: string }) {
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const clusteringData = await model.clusterBig();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Comment Clusters
      </h3>
      <Suspense
        fallback={
          <div className="h-80 flex items-center justify-center">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
        }
      >
        <CommentClusters initialData={clusteringData} videoId={videoId} />
      </Suspense>
    </div>
  );
}

CommentsClustersCard.Skeleton = function CommentsClustersCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Comment Clusters
      </h3>
      <div className="h-80 flex items-center justify-center">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>
    </div>
  );
};
