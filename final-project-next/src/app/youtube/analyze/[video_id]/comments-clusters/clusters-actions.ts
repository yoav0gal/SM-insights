"use server";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
import type { ClusterData } from "./comments-cluster-tabs";

// TODO: Fix for server less -should work fine when pluged into the real fastapi server
const processingStore = new Map<string, number>();

export async function LLMClusterComments(videoId: string) {
  //TODO get video id and creator id from the request (or in a different way)
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const clusters = await model.clusterBig();

  return clusters;
}

export async function initDeepSTC(
  videoId: string
): Promise<{ success: boolean }> {
  // Simulate API call to start deep-STC processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Store the start time for this processing job
  processingStore.set(`deep-stc-${videoId}`, Date.now());

  return { success: true };
}

// New action to check deep-STC processing status
export async function checkDeepSTCStatus(videoId: string): Promise<{
  status: "processing" | "completed" | "failed";
  data?: ClusterData[];
  error?: string;
}> {
  // Simulate API call to check status
  const data = await LLMClusterComments(videoId);

  const processingKey = `deep-stc-${videoId}`;
  const startTime = processingStore.get(processingKey) || Date.now();
  const elapsedTime = Date.now() - startTime;

  // Simulate processing time (9 seconds)
  if (elapsedTime < 9000) {
    return { status: "processing" };
  }

  // Simulate a 10% chance of failure
  if (Math.random() < 0.1) {
    return {
      status: "failed",
      error: "Server error occurred during deep-STC processing",
    };
  }

  // Return success with mock data
  return {
    status: "completed",
    data: data,
  };
}
