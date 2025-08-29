"use client";
import { Skeleton } from "@/app/components/skeleton";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { clusterComments } from "./clusters-actions";

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

interface ClusterData {
  label: string;
  count: number;
  examples: string[];
  subclusters?: ClusterData[]; // For hierarchical clustering
}

type CommentClustersProps = {
  initialData: ClusterData[];
  videoId: string;
};

export function CommentClusters({
  initialData,
  videoId,
}: CommentClustersProps) {
  const [clusters, setClusters] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleRecluster = async () => {
    setLoading(true);
    const newClusters = await clusterComments(videoId);
    setClusters(newClusters);
    setLoading(false);
  };

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
        This chart represents the distribution of comment clusters. Each segment
        represents a different topic or sentiment found in the comments.
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
