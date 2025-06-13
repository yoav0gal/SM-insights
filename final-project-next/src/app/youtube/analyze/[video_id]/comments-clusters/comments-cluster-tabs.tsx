"use client";
import { useState, useEffect } from "react";
import { LLMCommentsClusters } from "./llm-comments-cluster";
import { DeepSTCCommentsClusters } from "./deep-stc-comments-cluster";
import { checkDeepSTCStatus, initDeepSTC } from "./cluster";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export interface ClusterData {
  label: string;
  count: number;
  examples: string[];
  subClusters?: ClusterData[];
}

type CommentClusterTabsProps = {
  videoId: string;
};

type TabStatus = "loading" | "success" | "error";

export function CommentClusterTabs({ videoId }: CommentClusterTabsProps) {
  const [activeTab, setActiveTab] = useState<"llm" | "deep-stc">("llm");
  const [deepSTCStatus, setDeepSTCStatus] = useState<TabStatus>("loading");
  const [deepSTCData, setDeepSTCData] = useState<ClusterData[] | null>(null);

  // Initialize deep-STC processing on component mount
  useEffect(() => {
    const startDeepSTC = async () => {
      try {
        const result = await initDeepSTC(videoId);
        if (result.success) {
          pollDeepSTCStatus();
        } else {
          setDeepSTCStatus("error");
        }
      } catch (error) {
        console.error("Failed to initialize deep-STC:", error);
        setDeepSTCStatus("error");
      }
    };

    startDeepSTC();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Poll for deep-STC status every 3 seconds
  const pollDeepSTCStatus = async () => {
    try {
      const result = await checkDeepSTCStatus(videoId);
      if (result.status === "completed") {
        setDeepSTCStatus("success");
        setDeepSTCData(result.data || []);
      } else if (result.status === "failed") {
        setDeepSTCStatus("error");
      } else {
        setTimeout(pollDeepSTCStatus, 3000);
      }
    } catch (error) {
      console.error("Failed to check deep-STC status:", error);
      setDeepSTCStatus("error");
    }
  };

  const getStatusIcon = () => {
    switch (deepSTCStatus) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin ml-2" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500 ml-2" />;
      case "error":
        return (
          <div className="group relative">
            <XCircle className="h-4 w-4 text-red-500 ml-2" />
            <span className="absolute left-0 top-6 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">
              Server error occurred
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("llm")}
              className={`inline-block p-4 ${
                activeTab === "llm"
                  ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-500 dark:border-purple-500"
                  : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              LLM-powered
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("deep-stc")}
              disabled={deepSTCStatus !== "success"}
              className={`inline-flex items-center p-4 ${
                activeTab === "deep-stc"
                  ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-500 dark:border-purple-500"
                  : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              } ${
                deepSTCStatus !== "success" && activeTab !== "deep-stc"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              deep-STC
              {getStatusIcon()}
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "llm" ? (
          <LLMCommentsClusters videoId={videoId} />
        ) : (
          <DeepSTCCommentsClusters
            data={deepSTCData || []}
            videoId={videoId}
            status={deepSTCStatus}
          />
        )}
      </div>
    </div>
  );
}
