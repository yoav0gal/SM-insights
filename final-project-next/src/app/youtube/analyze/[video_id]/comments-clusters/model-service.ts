// No `"use server"` at the top here — this is a utility, not an action
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
import type { AnalysisModel } from "../analysis";

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
}


// export class ModelService {
//   private model!: AnalysisModel;

//   constructor(private videoId: string, private creatorId: string = DEFAULT_CREATOR_ID) {}

//   public async init(): Promise<void> {
//     this.model = await getModel(this.videoId, this.creatorId);
//   }

//   public async clusterCommentsHierarchical() {
//     if (!this.model) {
//       throw new Error("Model not initialized. Call init() first.");
//     }

//     const clusters = await this.model.clusterHierarchical();
//     return clusters;
//   }
// }

// export class ModelService {
//   private model!: AnalysisModel;

//   constructor(
//     private videoId: string,
//     private creatorId: string = DEFAULT_CREATOR_ID
//   ) {}

//   public async init(): Promise<void> {
//     this.model = await getModel(this.videoId, this.creatorId);
//   }

//   public async clusterCommentsHierarchical() {
//     if (!this.model) {
//       throw new Error("Model not initialized. Call init() first.");
//     }

//     return await this.model.clusterHierarchical();
//   }

//   public async checkDeepSTCStatus(): Promise<{
//     status: "processing" | "completed" | "failed";
//     data?: ClusterData[];
//     error?: string;
//   }> {
//     try {
//       console.log(`${STC_BACKEND_BASE_URL}/deep-stc/process-status`);

//       const statusResponse = await axios.get(
//         `${STC_BACKEND_BASE_URL}/deep-stc/process-status`,
//         {
//           params: {
//             video_id: this.videoId,
//             limit: YOUTUBE_DEFAULT_COMMENTS_LIMIT,
//           },
//         }
//       );

//       const statusData = statusResponse.data;

//       if (statusData.status === "running") {
//         return { status: "processing" };
//       }

//       if (statusData.status === "completed") {
//         const resultsResponse = await axios.get(
//           `${STC_BACKEND_BASE_URL}/deep-stc/analysis-results`,
//           {
//             params: {
//               video_id: this.videoId,
//               limit: YOUTUBE_DEFAULT_COMMENTS_LIMIT,
//             },
//           }
//         );

//         const resultsData = resultsResponse.data;
//         return {
//           status: "completed",
//           data: resultsData.results,
//         };
//       }

//       if (statusData.status === "error") {
//         return {
//           status: "failed",
//           error: "Server error occurred during deep-STC processing",
//         };
//       }

//       return { status: "processing" };
//     } catch (error) {
//       console.error("Error checking deep-STC status:", error);

//       // Simulate time-based fallback
//       const requestStartTime = Date.now();
//       const staticStartTime = requestStartTime - (requestStartTime % PROCESSING_TIMEOUT);
//       const elapsedTime = requestStartTime - staticStartTime;

//       if (elapsedTime < PROCESSING_TIMEOUT) {
//         return { status: "processing" };
//       }

//       // Fallback to LLM clustering
//       try {
//         const fallbackClusters = await this.clusterCommentsHierarchical();
//         return {
//           status: "completed",
//           data: fallbackClusters,
//         };
//       } catch (e) {
//         return {
//           status: "failed",
//           error: String(e),
//         };
//       }
//     }
//   }
// }

// export async function fetchModel(videoId: string) {
//   return await getModel(videoId, DEFAULT_CREATOR_ID);
//   //TODO get video id and creator id from the request (or in a different way)
// }

// export async function LLMClusterComments(model: AnalysisModel) {
//   //TODO get video id and creator id from the request (or in a different way)
//   // const model = await getModel(videoId, DEFAULT_CREATOR_ID);

//   const clusters = await model.clusterHierarchical();

//   return clusters;
// }