import Image from "next/image";
import { Skeleton } from "@/app/components/skeleton";
import { fetchVideoDetails } from "@/app/api/youtube/video-details/actions";

function VideoDetailsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export async function VideoDetailsComponent({ videoId }: { videoId: string }) {
  const details = await fetchVideoDetails(videoId);
  if (details == null) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="aspect-video mb-4 relative overflow-hidden rounded-lg">
        <Image
          src={details.thumbnail || "/placeholder.svg"}
          alt={details.title || "Video thumbnail"}
          fill
          className="object-cover"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {details.title}
      </h2>
      <div className="flex items-center mb-2">
        <Image
          src={details.channelImage || "/placeholder.svg"}
          alt={details.channelName || "Channel"}
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {details.channelName}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div>Views: {details.views}</div>
        <div>Likes: {details.likes}</div>
        <div>Dislikes: {details.dislikes}</div>
        <div>Comments: {details.comments}</div>
        <div className="col-span-2">
          Uploaded: {new Date(details.uploadTime || "").toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

VideoDetailsComponent.Skeleton = VideoDetailsSkeleton;
