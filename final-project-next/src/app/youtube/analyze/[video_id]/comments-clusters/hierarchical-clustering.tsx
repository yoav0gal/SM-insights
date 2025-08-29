"use client";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { X } from "lucide-react";
import type { ClusterData } from "./comments-cluster-tabs";

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ClusterData[];
};

export default function DeepSTCClustersModal({ isOpen, onClose, data }: Props) {
  const [activeTab, setActiveTab] = useState<"chart" | "members">("chart");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "chart"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "members"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
        </div>

        {activeTab === "chart" && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  isAnimationActive={false}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-modal-${index}`}
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
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="max-h-[500px] overflow-y-auto space-y-4">
            {data.map((cluster, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <h3 className="font-semibold mb-2">
                  {cluster.label.replace(/,/g, "")} ({cluster.count})
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {cluster.members?.map((example, eIdx) => (
                    <li key={eIdx} className="text-gray-700 dark:text-gray-300">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
