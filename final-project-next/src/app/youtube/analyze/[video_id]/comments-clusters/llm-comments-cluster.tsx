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
import { CommentsBreadcrumbs } from "./CommentsBreadcrumbs";


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

type CommentClustersProps = {
  videoId: string;
};

export function LLMCommentsClusters({ videoId }: CommentClustersProps) {
  const [clusters, setClusters] = useState<ClusterData[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
  }, [videoId]);

  useEffect(() => {
    handleRecluster();
  }, [handleRecluster]);

  const handleClusterClick = (data: any, index: number) => {
    const clickedCluster = clusters[clusterPath.length][index];
    if (clickedCluster) {
      setClusterPath([...clusterPath, clickedCluster.label]);
      setClusters((prevClusters) => [
        ...prevClusters,
        clickedCluster.subclusters || [],
      ]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-4xl mx-auto min-h-[36rem] flex flex-col gap-4 text-gray-800 dark:text-gray-200">

      {loading ? (
        <div className="h-80 flex items-center justify-center">
        <Skeleton className="h-64 w-64" style={{borderRadius:"100%"}} />
      </div>
      ) : !clusters[clusterPath.length] || clusters[clusterPath.length].length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[22rem]">
          <p>No clusters found for this level.</p>
        </div>
      ) : (     
        <>
      <div className="flex items-center justify-between mb-12">
        <CommentsBreadcrumbs
          path={clusterPath}
          onNavigate={(level) => {
            setClusterPath(clusterPath.slice(0, level));
            setClusters(clusters.slice(0, level + 1));
          }}
        />
      </div>
        <div className="flex-grow w-full">
          <div className="w-full flex justify-center">
            <ResponsiveContainer width={550} height={550}>
              <PieChart>
                <Pie
                  data={clusters[clusterPath.length]}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  fill="#6366f1"
                  dataKey="count"
                  label
                >
                  {clusters[clusterPath.length].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      name={entry.label}
                      cursor={
                        entry.subclusters && entry.subclusters.length > 0
                          ? "pointer"
                          : "not-allowed"
                      }
                      onClick={
                        entry.subclusters && entry.subclusters.length > 0
                          ? (e) => handleClusterClick(e, index)
                          : undefined
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{ marginTop: 32 }}
                  formatter={(clusterLabel, entry) => {
                    return `${clusterLabel} : ${entry.payload?.value}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        </> 
      )}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        This chart represents the distribution of comment clusters using
        LLM-powered analysis. Each segment represents a different topic or
        sentiment found in the comments.
      </p>
    </div>
  );
}
