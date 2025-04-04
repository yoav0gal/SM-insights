"use client";
import { Skeleton } from "@/app/components/skeleton";
import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { LLMClusterComments } from "./clusters-actions";
import type { ClusterData } from "./comments-cluster-tabs";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1919",
  "#19FF19",
  "#1919FF",
  "#FF19FF",
  "#19FFFF",
];

type CommentClustersProps = {
  videoId: string;
};

export function LLMCommentsClusters({ videoId }: CommentClustersProps) {
  const [clusters, setClusters] = useState([] as ClusterData[]);
  const [loading, setLoading] = useState(true);

  const handleRecluster = useCallback(async () => {
    setLoading(true);
    try {
      const newClusters = await LLMClusterComments(videoId);
      setClusters(newClusters);
    } catch (error) {
      console.error("Error reclustering comments:", error);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    handleRecluster();
  }, [handleRecluster]);

  return (
    <>
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <Skeleton className="h-64 w-64 rounded-full" />
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clusters}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label
              >
                {clusters.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    name={entry.label}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                formatter={(clusterLabel, entry) => {
                  return `${clusterLabel} : ${entry.payload?.value}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        This chart represents the distribution of comment clusters using
        LLM-powered analysis. Each segment represents a different topic or
        sentiment found in the comments.
      </p>
      <button
        onClick={handleRecluster}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Re-clustering..." : "Re-cluster Comments"}
      </button>
    </>
  );
}
