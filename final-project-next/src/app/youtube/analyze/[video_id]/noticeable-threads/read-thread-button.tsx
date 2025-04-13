"use client";

import { useState } from "react";
import { ThreadSkeleton, type Thread } from "./noticeable-threads";

type ReadThreadButtonProps = {
  thread: Thread;
};
export function ReadThreadButton(props: ReadThreadButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threadContent, setThreadContent] = useState<string | null>(null);

  const handleReadThread = async () => {
    if (expanded) {
      setExpanded(false);
      setThreadContent(null);
    } else {
      setLoading(true);
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real application, you would fetch the full thread from an API
      setThreadContent(
        "This is where the full thread content would be displayed. In a real application, this would show all the replies and nested comments."
      );
      setExpanded(true);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleReadThread}
        className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
      >
        {expanded ? "Hide Thread" : "Read Thread"}
      </button>
      {loading && <ThreadSkeleton />}
      {expanded && threadContent && (
        <div className="mt-4 pl-4 border-l-2 border-purple-300 dark:border-purple-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {threadContent}
          </p>
        </div>
      )}
    </>
  );
}
