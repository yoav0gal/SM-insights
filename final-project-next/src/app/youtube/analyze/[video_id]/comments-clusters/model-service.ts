import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
import type { AnalysisModel } from "../analysis";
import { ClusterData } from "./comments-cluster-tabs";
import {
  STC_BACKEND_BASE_URL,
  YOUTUBE_DEFAULT_COMMENTS_LIMIT,
} from "@/app/constants";
import axios from "axios";

const PROCESSING_TIMEOUT = 9000;

export class ModelService {
  private model!: AnalysisModel;

  constructor(
    private videoId: string,
    private creatorId: string = DEFAULT_CREATOR_ID
  ) {}

  public async init(): Promise<void> {
    this.model = await getModel(this.videoId, this.creatorId);
  }

  public async clusterCommentsHierarchical() {
    if (!this.model) throw new Error("Model not initialized.");
    return await this.model.clusterHierarchical();
  }

  public async initDeepSTC(): Promise<{ success: boolean }> {
    try {
      await axios.post(
        `${STC_BACKEND_BASE_URL}/deep-stc/initialize-process`,
        {},
        {
          params: {
            video_id: this.videoId,
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
      return { success: false };
    }
  }

  public async checkDeepSTCStatus(): Promise<{
    status: "processing" | "completed" | "failed";
    data?: ClusterData[];
    error?: string;
  }> {
    try {
      const statusResponse = await axios.get(
        `${STC_BACKEND_BASE_URL}/deep-stc/process-status`,
        {
          params: {
            video_id: this.videoId,
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
              video_id: this.videoId,
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

      if (statusData.status === "error") {
        return {
          status: "failed",
          error: "Server error occurred during deep-STC processing",
        };
      }

      return { status: "processing" };
    } catch (error) {
      console.error("Error checking deep-STC status:", error);

      const requestStartTime = Date.now();
      const staticStartTime =
        requestStartTime - (requestStartTime % PROCESSING_TIMEOUT);
      const elapsedTime = requestStartTime - staticStartTime;

      if (elapsedTime < PROCESSING_TIMEOUT) {
        return { status: "processing" };
      }

      try {
        const fallbackClusters = await this.clusterCommentsHierarchical();
        return {
          status: "completed",
          data: fallbackClusters,
        };
      } catch (e) {
        return {
          status: "failed",
          error: String(e),
        };
      }
    }
  }
}
