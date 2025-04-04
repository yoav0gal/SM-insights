import { USE_YOUTUBE_API_MOCKS } from "@/app/constants";
import { youtubeVideoDetailsMocks } from "./mocks";
import { youtube } from "@/app/clients/youtube";

export type VideoDetails = {
  title: string | null | undefined;
  views: string | null | undefined;
  likes: string | null | undefined;
  dislikes: string | null | undefined;
  thumbnail: string | null | undefined;
  channelName: string | null | undefined;
  channelImage: string | null | undefined;
  uploadTime: string | null | undefined;
  comments: string | null | undefined;
};

export async function fetchVideoDetailsLogic(
  videoId: string
): Promise<VideoDetails | null> {
  if (USE_YOUTUBE_API_MOCKS) return youtubeVideoDetailsMocks;

  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [videoId],
    });

    if (!response?.data?.items?.length) {
      return null;
    }

    const videoData = response.data.items[0];
    const channelId = videoData.snippet?.channelId;

    // Retrieve channel details
    const channelResponse = await youtube.channels.list({
      part: ["snippet"],
      id: [channelId as string],
    });
    const channelData = channelResponse?.data?.items?.[0];

    const videoDetails = {
      title: videoData.snippet?.title,
      views: videoData.statistics?.viewCount,
      likes: videoData.statistics?.likeCount,
      dislikes: videoData.statistics?.dislikeCount,
      thumbnail: videoData.snippet?.thumbnails?.high?.url,
      channelName: videoData.snippet?.channelTitle,
      channelImage: channelData?.snippet?.thumbnails?.default?.url,
      uploadTime: videoData.snippet?.publishedAt,
      comments: videoData.statistics?.commentCount,
    };

    return videoDetails;
  } catch (error: any) {
    console.error("Error fetching video data:", error);
    throw new Error(
      error.message || "An error occurred while fetching video data."
    );
  }
}
