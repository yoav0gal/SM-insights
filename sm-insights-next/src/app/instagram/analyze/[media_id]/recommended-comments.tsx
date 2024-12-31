import { ThumbsUp } from "lucide-react";

export interface Comment {
  id: string;
  text: string;
  from: { id: string; username: string };
  like_count: number;
}

interface RecommendedCommentsProps {
  comments: Comment[];
}

export function RecommendedComments({ comments }: RecommendedCommentsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Recommended Comments
      </h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {comment.from.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {comment.text}
                </p>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span className="text-sm">{comment.like_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
