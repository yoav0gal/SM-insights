import { ThumbsUp } from "lucide-react";

export interface Comment {
  id: string;
  text: string;
  from: { id: string; username: string };
  like_count: number;
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (!comments) return null;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-purple-700 dark:text-purple-200 font-semibold text-sm mr-3">
                {comment.from.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {comment.from.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {comment.text}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span className="text-sm">{comment.like_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
