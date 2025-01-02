import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import {
  generateSystemInstructions,
  TASK_NAMES,
} from "./youtube-analysis-constants";

import { getVideoCommentsLogic } from "@/app/api/youtube/comments/logic";
import type { KeyTakeaways } from "./key-takeaways/key-takeaways";
import type { TransformedComment } from "@/app/api/youtube/comments/logic";
import type { Thread } from "./noticeable-threads/noticeable-threads";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? "Add Your Gemini API key"
);

interface ClusterResult {
  label: string;
  count: number;
  examples: string[];
  subClusters?: ClusterResult[]; // For hierarchical clustering
}

type AnalysisModel = GenerativeModel & {
  keyTakeaways(): Promise<KeyTakeaways>;
  recommendations(): Promise<TransformedComment[]>;
  noticeableThreads(): Promise<Thread[]>;
  search(query: string): Promise<TransformedComment[]>;
  deepDive(query: string): Promise<string>;
  clusterBig(): Promise<ClusterResult[]>;
  clusterSmall(): Promise<ClusterResult[]>;
  clusterHierarchical(): Promise<ClusterResult[]>;
};

const activeModels = new Map<string, AnalysisModel>();

export function getGenerativeModel(systemInstruction: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
  });

  return model;
}

function formatGeminiJsonResponse<T>(responseText: string): T {
  if (responseText.startsWith("```json") && responseText.endsWith("```\n")) {
    return JSON.parse(responseText.slice(7, -4));
  }
  return JSON.parse(responseText);
}

async function addAnalysisTasksToModel(
  model: GenerativeModel
): Promise<AnalysisModel> {
  async function executeTask<T>(prompt: string) {
    const response = await model.generateContent(prompt);
    return formatGeminiJsonResponse<T>(response.response.text());
  }

  const taskMap = {
    keyTakeaways: async () =>
      await executeTask<KeyTakeaways>(
        `The task is: ${TASK_NAMES.KEY_TAKEAWAYS}`
      ),
    recommendations: async () =>
      await executeTask<TransformedComment[]>(
        `The task is: ${TASK_NAMES.RECOMMENDATIONS}`
      ),
    noticeableThreads: async () =>
      await executeTask<Thread[]>(
        `The task is: ${TASK_NAMES.NOTICEABLE_THREADS}`
      ),
    search: async (query: string) =>
      await executeTask<TransformedComment[]>(
        `The task is: ${TASK_NAMES.SEARCH}, the query is: ${query}`
      ),
    deepDive: async (query: string) => {
      const response = await model.generateContent(
        `The task is: ${TASK_NAMES.DEEP_DIVE}, the query is: ${query}`
      );
      return response.response.text();
    },
    clusterBig: async () =>
      await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_BIG}`
      ),
    clusterSmall: async () =>
      await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_SMALL}`
      ),
    clusterHierarchical: async () =>
      await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_HIERARCHICAL}`
      ),
  };

  // Add the taskMap functions to the model
  Object.assign(model, taskMap);

  return model as AnalysisModel;
}

export async function createModel(videoId: string, creatorId: string) {
  const { comments } = await getVideoCommentsLogic(videoId);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const systemInstructions = await generateSystemInstructions(
    comments,
    videoUrl,
    creatorId
  );
  const model = getGenerativeModel(systemInstructions) as AnalysisModel;

  const analysisModel = await addAnalysisTasksToModel(model);

  return analysisModel;
}

export async function getModel(videoId: string, creatorId: string) {
  if (activeModels.has(`${creatorId}-${videoId}`)) {
    return activeModels.get(`${creatorId}-${videoId}`) as AnalysisModel;
  }
  const model = await createModel(videoId, creatorId);
  activeModels.set(`${creatorId}-${videoId}`, model);
  return model;
}

export async function pageData(model: GenerativeModel) {
  const recommendsPromise = model.generateContent(TASK_NAMES.RECOMMENDATIONS);
  const keyTakeAwaysPromise = model.generateContent(TASK_NAMES.KEY_TAKEAWAYS);
  const noticeableThreadsPromise = model.generateContent(
    TASK_NAMES.NOTICEABLE_THREADS
  );
  const clusteringPromise = model.generateContent(TASK_NAMES.CLUSTER_BIG);

  const pageData = await Promise.all([
    recommendsPromise,
    keyTakeAwaysPromise,
    noticeableThreadsPromise,
    clusteringPromise,
  ]);

  const recommendations = formatGeminiJsonResponse(pageData[0].response.text());
  const keyTakeAways = formatGeminiJsonResponse(pageData[1].response.text());
  const noticeableThreads = formatGeminiJsonResponse(
    pageData[2].response.text()
  );
  const clustering = formatGeminiJsonResponse(pageData[3].response.text());

  return {
    recommendations,
    keyTakeAways,
    noticeableThreads,
    clustering,
  };
}
