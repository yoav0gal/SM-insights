"use server";
import { YOUTUBE_DEFAULT_COMMENTS_LIMIT } from "@/app/constants";
import { getVideoCommentsLogic } from "./logic";

export type TransformedComment = {
  displayText: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl: string;
  likeCount: number;
  updatedAt: string;
  totalReplyCount: number;
  replies: TransformedComment[] | [];
};
export async function getVideoComments(
  videoId: string,
  limit: number = YOUTUBE_DEFAULT_COMMENTS_LIMIT
) {
  "use server";
  return await getVideoCommentsLogic(videoId, limit);
}
