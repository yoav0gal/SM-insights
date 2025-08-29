"use client";
import { useState } from "react";
import { Skeleton } from "@/app/components/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { AlertCircle } from "lucide-react";
import type { ClusterData } from "./comments-cluster-tabs";
import { CommentsBreadcrumbs } from "./CommentsBreadcrumbs";
import { ViewIndividualsButton } from "./ViewIndividualsButton";
import { CommentsTableModal } from "./CommentsTableModal";

const COLORS = [
  "#6366f1", // indigo-500
  "#10b981", // emerald-500
  "#f59e42", // orange-400
  "#f43f5e", // rose-500
  "#a21caf", // purple-700
  "#fbbf24", // yellow-400
  "#0ea5e9", // sky-500
  "#eab308", // yellow-600
  "#14b8a6", // teal-500
  "#f472b6", // pink-400
];

type DeepSTCClustersProps = {
  data: ClusterData[];
  videoId: string;
  status: "idle" | "loading" | "success" | "error";
};

export function DeepSTCCommentsClusters({ data, status }: DeepSTCClustersProps) {
  const [clusterPath, setClusterPath] = useState<string[]>([]);
  const [clusters, setClusters] = useState<ClusterData[][]>([data]);
  const [showIndividuals, setShowIndividuals] = useState(false);

  // Drilldown logic
  const handleClusterClick = (_: any, index: number) => {
    const clickedCluster = clusters[clusterPath.length][index];
    if (clickedCluster && clickedCluster.subclusters && clickedCluster.subclusters.length > 0) {
      setClusterPath([...clusterPath, clickedCluster.label]);
      setClusters((prev) => [...prev, clickedCluster.subclusters || []]);
    }
  };

  // Helper to get all comments at current level
  const getCurrentComments = () => {
    const currentClusters = clusters[clusterPath.length] || [];
    const comments: { comment: string; cluster: string; clusterIdx: number }[] = [];
    currentClusters.forEach((c, idx) => {
      (c.members || []).forEach((m) => {
        comments.push({ comment: m, cluster: c.label, clusterIdx: idx });
      });
    });
    return comments;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-4xl mx-auto min-h-[28rem] flex flex-col gap-2 text-gray-800 dark:text-gray-200">
      {status === "loading" ? (
        <div className="flex flex-col items-center justify-center min-h-[18rem]">
          <Skeleton className="w-1/2 h-1/2 rounded-full" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Processing deep-STC clustering. This may take a few minutes...
          </p>
        </div>
      ) : status === "error" ? (
        <div className="flex flex-col items-center justify-center text-destructive min-h-[18rem]">
          <AlertCircle size={64} />
          <p className="mt-4 text-lg font-semibold">
            An error occurred while processing deep-STC clustering
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please try again later or contact support if the issue persists.
          </p>
        </div>
      ) : !clusters[clusterPath.length] || clusters[clusterPath.length].length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[18rem]">
          <p>No clusters found for this level.</p>
        </div>
      ) : (
        <>
         <div className="flex items-center justify-between mb-4">
         <CommentsBreadcrumbs
          path={clusterPath}
          onNavigate={(level) => {
            setClusterPath(clusterPath.slice(0, level));
            setClusters(clusters.slice(0, level + 1));
          }}
          />
        <ViewIndividualsButton onClick={() => setShowIndividuals(true)} />
        </div>
        <div className="flex-grow w-full">
          <div className="w-full flex justify-center">
            <ResponsiveContainer width={550} height={550}>
              <PieChart>
                <Pie
                  data={clusters[clusterPath.length]}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#6366f1"
                  dataKey="count"
                  label
                  onClick={(_, index) => handleClusterClick(_, index)}
                >
                  {clusters[clusterPath.length].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      name={entry.label}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{ marginTop: 24 }}
                  formatter={(clusterLabel, entry) =>
                    `${clusterLabel} : ${entry.payload?.value}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        </>
      )}
      <CommentsTableModal
        open={showIndividuals}
        onClose={() => setShowIndividuals(false)}
        comments={getCurrentComments()}
        clusterName={clusterPath.length === 0 ? "All" : clusterPath[clusterPath.length - 1]}
      />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        This chart represents the distribution of comment clusters using
        deep-STC analysis, which provides more accurate and nuanced clustering
        based on Spectral Temporal Clustering.
      </p>
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
        <p className="text-sm text-purple-800 dark:text-purple-300">
          <strong>Note:</strong> deep-STC analysis uses advanced algorithms that
          may identify different patterns than LLM-powered analysis. The results
          are typically more precise but require more processing time.
        </p>
      </div>
    </div>
  );
}
