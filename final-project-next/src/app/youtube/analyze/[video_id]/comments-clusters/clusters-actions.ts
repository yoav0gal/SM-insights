"use server";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
import type { ClusterData } from "./comments-cluster-tabs";
import {
  YOUTUBE_DEFAULT_COMMENTS_LIMIT,
  STC_BACKEND_BASE_URL,
} from "@/app/constants";
import axios from "axios";

// Fallback timeout in milliseconds for processing simulation
const PROCESSING_TIMEOUT = 9000;

export async function LLMClusterComments(videoId: string) {
  //TODO get video id and creator id from the request (or in a different way)
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const clusters = await model.clusterBig();

  return clusters;
}

export async function initDeepSTC(
  videoId: string
): Promise<{ success: boolean }> {
  try {
    const response = await axios.post(
      `${STC_BACKEND_BASE_URL}/deep-stc/initialize-process`,
      {},
      {
        params: {
          video_id: videoId,
          limit: YOUTUBE_DEFAULT_COMMENTS_LIMIT,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error initializing deep-STC:", error);
    return { success: true };
  }
}

export async function checkDeepSTCStatus(videoId: string): Promise<{
  status: "processing" | "completed" | "failed";
  data?: ClusterData[];
  error?: string;
}> {
  try {
    console.log(`${STC_BACKEND_BASE_URL}/deep-stc/process-status`);
    const statusResponse = await axios.get(
      `${STC_BACKEND_BASE_URL}/deep-stc/process-status`,
      {
        params: {
          video_id: videoId,
          limit: YOUTUBE_DEFAULT_COMMENTS_LIMIT,
        },
      }
    );

    const statusData = statusResponse.data;

    if (statusData.status === "running") {
      return { status: "processing" };
    }

    if (statusData.status === "completed") {
      const resultsResponse = await axios.get(
        `${STC_BACKEND_BASE_URL}/deep-stc/analysis-results`,
        {
          params: {
            video_id: videoId,
            limit: YOUTUBE_DEFAULT_COMMENTS_LIMIT,
          },
        }
      );

      const resultsData = resultsResponse.data;
      return {
        status: "completed",
        data: resultsData.results,
      };
    }

    // If the process failed, return error status
    if (statusData.status === "error") {
      return {
        status: "failed",
        error: "Server error occurred during deep-STC processing",
      };
    }

    // Fallback to processing status for any other state
    return { status: "processing" };
  } catch (error) {
    console.error("Error checking deep-STC status:", error);

    // Use static timestamp for fallback simulation
    const requestStartTime = Date.now();
    const staticStartTime =
      requestStartTime - (requestStartTime % PROCESSING_TIMEOUT);
    const elapsedTime = requestStartTime - staticStartTime;

    // Fallback simulation logic
    if (elapsedTime < PROCESSING_TIMEOUT) {
      return { status: "processing" };
    }
    String();

    // Get fallback data from LLM clustering
    try {
      const data = await LLMClusterComments(videoId);
      return {
        status: "completed",
        data: data,
      };
    } catch (e) {
      return {
        status: "failed",
        error: String(e),
      };
    }
  }
}
