"use client";

import { useState } from "react";
import { TransformedComment } from "@/app/api/youtube/comments/logic";
import { ThreadComment } from "./threadComment";

export interface ThreadProps {
  comment: TransformedComment;
  summary: string;
  topic: string;
  totalReplyCount: number;
}

export function Thread({ thread }: { thread: ThreadProps }) {
  const [expanded, setExpanded] = useState(false);

  const toggleReadThread = async () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
        {thread.topic}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {thread.summary}
      </p>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Replies: {thread.totalReplyCount}
      </div>
      <button
        onClick={toggleReadThread}
        className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
      >
        {expanded ? "Hide Thread" : "Read Thread"}
      </button>
      {expanded && (
        <div className="mt-4 pl-4 border-l-2 border-purple-300 dark:border-purple-700">
          <ThreadComment comment={thread.comment} depth={0} />
        </div>
      )}
    </div>
  );
}
