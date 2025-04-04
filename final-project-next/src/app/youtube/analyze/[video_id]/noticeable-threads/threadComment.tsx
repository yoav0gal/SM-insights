"use client";
import { useState } from "react";
import Image from "next/image";
import { TransformedComment } from "@/app/api/youtube/comments/logic";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CommentProps {
  comment: TransformedComment;
  depth?: number;
}

export function ThreadComment({ comment, depth = 0 }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const maxDepth = 3; // Maximum depth for nested comments
  const hasReplies = comment?.replies && comment.replies.length > 0;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={`flex items-start space-x-3 ${depth > 0 ? "ml-6" : ""}`}>
      <Image
        src={comment.authorProfileImageUrl}
        alt={comment.authorDisplayName}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          {comment.authorDisplayName}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {comment.displayText}
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Likes: {comment.likeCount} | Replies: {comment.totalReplyCount}
        </div>
        {hasReplies && depth < maxDepth && (
          <button
            onClick={toggleReplies}
            className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
            aria-expanded={showReplies}
          >
            {showReplies ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Replies
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Read Replies ({comment.totalReplyCount})
              </>
            )}
          </button>
        )}
        {showReplies && hasReplies && depth < maxDepth && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {comment.replies.map((reply, index) => (
              <ThreadComment key={index} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
