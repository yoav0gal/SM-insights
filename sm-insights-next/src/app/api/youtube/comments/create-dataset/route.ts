import { YOUTUBE_DEFAULT_COMMENTS_LIMIT } from "@/app/constants";
import { NextRequest, NextResponse } from "next/server";
import { getVideoCommentsLogic } from "../logic";
import { saveArrayToCSV } from "@/app/lib/arrayToCSV";
import { DOMAIN } from "@/app/constants";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const videoId = searchParams.get("video_id");
  const commentsLimit = Number(
    searchParams.get("limit") ?? YOUTUBE_DEFAULT_COMMENTS_LIMIT
  );
  const dataSetName = searchParams.get("data_set_name");

  if (!videoId || typeof videoId !== "string") {
    return new NextResponse("Missing video ID", { status: 400 });
  }

  if (!dataSetName || typeof dataSetName !== "string") {
    return new NextResponse("Missing dataSetName ", { status: 400 });
  }

  if (!DOMAIN.includes("localhost")) {
    return new NextResponse("This route is valid only locally for now ", {
      status: 400,
    });
  }

  const savePath = `../Notebooks/datasets/youtube-comments/${dataSetName}.csv`;

  try {
    const { comments } = await getVideoCommentsLogic(videoId, commentsLimit);
    saveArrayToCSV(
      comments.map((comment) => {
        const newComment = {
          text: comment.displayText,
          author: comment.authorDisplayName,
          likes: comment.likeCount,
          replyCount: comment.totalReplyCount,
        };
        return newComment;
      }),
      savePath
    );
    return NextResponse.json(`dataset was saved to ${savePath}`);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error Fetching comments", { status: 500 });
  }
}
