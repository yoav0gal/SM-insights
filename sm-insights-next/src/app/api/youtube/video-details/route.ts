import { NextRequest, NextResponse } from "next/server";
import { youtube } from "@/app/clients/youtube";
import { youtubeVideoDetailsMocks } from "./mocks";
import { USE_YOUTUBE_API_MOCKS } from "@/app/constants";
import { VideoDetails } from "./actions";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const videoId = searchParams.get("video_id");

  if (!videoId || typeof videoId !== "string") {
    return new NextResponse("Missing video ID", { status: 400 });
  }
  if (USE_YOUTUBE_API_MOCKS) return NextResponse.json(youtubeVideoDetailsMocks);

  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [videoId],
    });

    if (!response?.data?.items?.length) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const videoData = response.data.items[0];
    const channelId = videoData.snippet?.channelId;

    // Retrieve channel details
    const channelResponse = await youtube.channels.list({
      part: ["snippet"],
      id: [channelId as string],
    });
    const channelData = channelResponse?.data?.items?.[0];

    const videoDetails: VideoDetails = {
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

    return NextResponse.json(videoDetails);
  } catch (error: any) {
    console.error("Error fetching video data:", error);
    return new NextResponse("Error fetching video data", { status: 500 });
  }
}
