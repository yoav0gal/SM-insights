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
import DeepSTCClustersModal from "./hierarchical-clustering";

const COLORS = [
  "#FF4560",
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#775DD0",
  "#FF9800",
  "#4CAF50",
  "#2196F3",
  "#F44336",
  "#9C27B0",
];

type DeepSTCClustersProps = {
  data: ClusterData[];
  videoId: string;
  status: "idle" | "loading" | "success" | "error";
};

export function DeepSTCCommentsClusters({
  data,
  status,
}: DeepSTCClustersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<ClusterData[]>([]);

  if (status === "loading") {
    return (
      <div className="h-80 flex flex-col items-center justify-center">
        <Skeleton className="h-64 w-64 rounded-full" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Processing deep-STC clustering. This may take a few minutes...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-red-500">
        <AlertCircle size={64} />
        <p className="mt-4 text-lg font-semibold">
          An error occurred while processing deep-STC clustering
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please try again later or contact support if the issue persists.
        </p>
      </div>
    );
  }

  const handleSliceClick = (clustersData: typeof data, index: number) => {

    const cluster = clustersData[index];
    setTimeout(() => {
      setSelectedCluster(cluster.subclusters ?? []);
    }, 0);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="h-[30rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label
              onClick={(_, index) => handleSliceClick(data, index)} // capture clicked slice
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  name={entry.label}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              formatter={(clusterLabel, entry) =>
                `${clusterLabel} : ${entry.payload?.value}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <DeepSTCClustersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedCluster}
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
    </>
  );
}
