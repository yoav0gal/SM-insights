import { TransformedComment } from "@/app/api/youtube/comments/logic";
import Image from "next/image";

export function Comment({ comment }: { comment: TransformedComment }) {
  return (
    <div className="flex items-start space-x-3">
      <Image
        src={comment.authorProfileImageUrl}
        alt={comment.authorDisplayName}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          {comment.authorDisplayName}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {comment.displayText}
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Likes: {comment.likeCount} | Replies: {comment.totalReplyCount}
        </div>
      </div>
    </div>
  );
}
