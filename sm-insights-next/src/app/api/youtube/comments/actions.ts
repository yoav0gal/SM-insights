"use server";
import { youtube } from "@/app/clients/youtube";
import {
  USE_YOUTUBE_API_MOCKS,
  YOUTUBE_DEFAULT_COMMENTS_LIMIT,
} from "@/app/constants";
import { commentsDataMock } from "./mocks";

type RawCommentSnippet = {
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl: string;
  textDisplay: string;
  likeCount: number;
  updatedAt: string;
};

type RawComment = {
  snippet: {
    topLevelComment: {
      snippet: RawCommentSnippet;
      id: string;
    };
    totalReplyCount: number;
  };
};

type RawReply = {
  snippet: RawCommentSnippet;
};

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

// Helper Function to Transform Comments and Replies
const transformComment = (
  item: RawCommentSnippet,
  totalReplyCount?: number
): TransformedComment => {
  return {
    displayText: item.textDisplay,
    authorDisplayName: item.authorDisplayName,
    authorProfileImageUrl: item.authorProfileImageUrl,
    authorChannelUrl: item.authorChannelUrl,
    likeCount: item.likeCount,
    updatedAt: item.updatedAt,
    totalReplyCount: totalReplyCount || 0,
    replies: [],
  };
};

// Helper function to fetch replies for a comment
async function fetchReplies(commentId: string): Promise<TransformedComment[]> {
  let allReplies: TransformedComment[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const pageToken = (nextPageToken ? { pageToken: nextPageToken } : {}) as
        | {
            pageToken: string;
          }
        | object;
      const response = await youtube.comments.list({
        part: ["snippet"],
        parentId: commentId,
        maxResults: 100,
        ...pageToken,
      });

      if (!response.data.items) break;

      const transformedReplies = (response.data.items as RawReply[]).map(
        (item) => transformComment(item.snippet)
      );
      allReplies = allReplies.concat(transformedReplies);
      nextPageToken = response.data.nextPageToken ?? undefined;
    } while (nextPageToken);

    return allReplies;
  } catch (error) {
    console.error("Error fetching replies", error);
    return [];
  }
}

export async function getVideoComments(
  videoId: string,
  limit: number = YOUTUBE_DEFAULT_COMMENTS_LIMIT
): Promise<{ comments: TransformedComment[]; commentsCount: number }> {
  "use server";
  console.log("valid log form getVideoComments");
  console.log(USE_YOUTUBE_API_MOCKS);
  if (USE_YOUTUBE_API_MOCKS) return commentsDataMock;

  let allComments: TransformedComment[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const pageToken = (nextPageToken ? { pageToken: nextPageToken } : {}) as
        | {
            pageToken: string;
          }
        | object;

      const response = await youtube.commentThreads.list({
        part: ["snippet"],
        videoId: videoId,
        maxResults: 10,
        ...pageToken,
      });

      if (!response.data.items) break;

      const transformedComments = await Promise.all(
        (response.data.items as RawComment[]).map(async (item) => {
          const transformedComment = transformComment(
            item.snippet.topLevelComment.snippet,
            item.snippet.totalReplyCount
          );
          const replies = await fetchReplies(item.snippet.topLevelComment.id);
          return { ...transformedComment, replies };
        })
      );

      allComments = allComments.concat(transformedComments);
      nextPageToken = response.data.nextPageToken ?? undefined;
    } while (nextPageToken && allComments.length < limit);

    return { comments: allComments, commentsCount: allComments.length };
  } catch (error: any) {
    console.error("Error fetching comments from google api", error);
    throw error;
  }
}
