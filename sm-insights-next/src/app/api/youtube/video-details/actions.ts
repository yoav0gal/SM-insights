"use server";
import { fetchVideoDetailsLogic } from "./logic";

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

export async function fetchVideoDetails(
  videoId: string
): Promise<VideoDetails | null> {
  "use server";
  return await fetchVideoDetailsLogic(videoId);
}
