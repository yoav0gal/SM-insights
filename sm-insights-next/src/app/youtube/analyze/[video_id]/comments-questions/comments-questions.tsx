"use client";

import React, { useState } from "react";
import { Skeleton } from "../../../../components/skeleton";
import { type TransformedComment } from "@/app/api/youtube/comments/actions";
import { askCommentsQuestion } from "./comments-questions-actions";

interface State {
  answer: string | null;
  error?: string | null;
}

const initialState: State = {
  answer: null,
  error: null,
};

interface CommentQuestionsProps {
  videoId: string;
}

export function CommentQuestions({ videoId }: CommentQuestionsProps) {
  const [state, setState] = useState<State>(initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = formData.get("question") as string;

    if (!question?.trim()) {
      setState({ answer: null, error: "Please enter a question" });
      return;
    }

    setLoading(true);

    try {
      const answer = await askCommentsQuestion(videoId, question);
      setState({ answer, error: null });
    } catch (error) {
      console.error("Error asking question:", error);
      setState({
        answer: null,
        error: "Sorry, there was an error processing your question.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Ask About Comments
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="question"
          placeholder="Ask a question about the comments..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {loading && <Skeleton />}

      {state.error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-md">
          <p className="text-red-800 dark:text-red-200">{state.error}</p>
        </div>
      )}

      {state.answer && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="text-gray-800 dark:text-gray-200">{state.answer}</p>
        </div>
      )}
    </div>
  );
}
