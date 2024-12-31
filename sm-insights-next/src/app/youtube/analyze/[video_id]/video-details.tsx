import Image from "next/image";
import { VideoDetails } from "@/app/api/youtube/video-details/actions";

export async function VideoDetailsComponent({
  details,
}: {
  details: VideoDetails | null;
}) {
  if (!details) return null;
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
