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
import type { ClusterData } from "./comments-cluster-tabs";
import { getLLMClusters } from "./cluster";

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
  const [clusters, setClusters] = useState([] as ClusterData[][]);
  const [loading, setLoading] = useState(true);
  const [clusterPath, setClusterPath] = useState<string[]>([]); // Track drill-down

  const handleRecluster = useCallback(async () => {
    setLoading(true);
    try {
      const newClusters = await getLLMClusters(videoId);
      setClusters((prevClusters) => [...prevClusters, newClusters]);
    } catch (error) {
      console.error("Error reclustering comments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleRecluster();
  }, [handleRecluster]);

  const handleClusterClick = (data: any, index: number) => {
    const clickedCluster = clusters[clusterPath.length][index];
    if (clickedCluster) {
      setClusterPath([...clusterPath, clickedCluster.label]);
      setClusters((prevClusters) => [
        ...prevClusters,
        clickedCluster.subClusters || [],
      ]);
    }
  };

  // Reset to root clustering
  const handleBack = () => {
    setClusterPath((prevClusterPath) => prevClusterPath.slice(0, -1));
    setClusters((prevClusters) => prevClusters.slice(0, -1));
  };

  return (
    <>
      {loading && !clusters.length ? (
        <div className="h-80 flex items-center justify-center">
          <Skeleton className="h-64 w-64 rounded-full" />
        </div>
      ) : (
        <div className="h-80">
          <div>{clusterPath.join(" > ")}</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clusters[clusterPath.length]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label
                onClick={handleClusterClick} // Pie-level click
              >
                {clusters[clusterPath.length].map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    name={entry.label}
                    cursor="pointer"
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
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleRecluster()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Re-clustering..." : "Re-cluster Comments"}
        </button>
        {clusterPath.length > 0 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Back
          </button>
        )}
      </div>
    </>
  );
}
