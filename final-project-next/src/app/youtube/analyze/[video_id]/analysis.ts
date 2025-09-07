"use server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import {
  DEFAULT_CREATOR_ID,
  generateSystemInstructions,
  TASK_NAMES,
} from "./youtube-analysis-constants";

import { getVideoCommentsLogic } from "@/app/api/youtube/comments/logic";
import type { KeyTakeaways } from "./key-takeaways/key-takeaways";
import type { TransformedComment } from "@/app/api/youtube/comments/logic";
import type { Thread } from "./noticeable-threads/noticeable-threads";
import { GEMINI_MODEL } from "@/app/constants";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? "Add Your Gemini API key"
);

interface ClusterResult {
  label: string;
  count: number;
  examples: string[];
  subclusters?: ClusterResult[]; // For hierarchical clustering
}

export type AnalysisModel = GenerativeModel & {
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

function getGenerativeModel(systemInstruction: string) {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemInstruction,
  });

  return model;
}

function formatGeminiJsonResponse<T>(responseText: string): T {
  if (
    responseText.startsWith("```json") &&
    (responseText.endsWith("```\n") || responseText.endsWith("```"))
  ) {
    return JSON.parse(responseText.slice(7, -4));
  }

  return JSON.parse(responseText);
}

async function addAnalysisTasksToModel(
  model: GenerativeModel
): Promise<AnalysisModel> {
  async function executeTask<T>(prompt: string) {
    const response = await model.generateContent(prompt);
    // const responseText = response.response.text();
    // console.log({ task: prompt, response: responseText });
    return formatGeminiJsonResponse<T>(response.response.text());
  }

  const taskMap = {
    keyTakeaways: async () => {
      const response = await executeTask<KeyTakeaways>(
        `The task is: ${TASK_NAMES.KEY_TAKEAWAYS}`
      );
      return response;
    },
    recommendations: async () => {
      const recommendationsResponse = await executeTask<TransformedComment[]>(
        `The task is: ${TASK_NAMES.RECOMMENDATIONS}`
      );
      return recommendationsResponse;
    },
    noticeableThreads: async () => {
      const response = await executeTask<Thread[]>(
        `The task is: ${TASK_NAMES.NOTICEABLE_THREADS}`
      );
      return response;
    },
    search: async (query: string) => {
      const response = await executeTask<TransformedComment[]>(
        `The task is: ${TASK_NAMES.SEARCH}, the query is: ${query}`
      );
      return response;
    },
    deepDive: async (query: string) => {
      const response = await model.generateContent(
        `The task is: ${TASK_NAMES.DEEP_DIVE}, the query is: ${query}`
      );
      return response.response.text();
    },
    clusterBig: async () => {
      const response = await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_BIG}`
      );
      return response;
    },
    clusterSmall: async () => {
      const response = await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_SMALL}`
      );
      return response;
    },
    clusterHierarchical: async () => {
      const response = await executeTask<ClusterResult>(
        `The task is: ${TASK_NAMES.CLUSTER_HIERARCHICAL}`
      );
      return response;
    },
  };

  // Add the taskMap functions to the model
  Object.assign(model, taskMap);

  return model as AnalysisModel;
}

export async function createModel(videoId: string, calledFrom:string, creatorId: string = DEFAULT_CREATOR_ID) {
  console.log("Creating model...");
  const { comments } = await getVideoCommentsLogic(videoId);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const systemInstructions = await generateSystemInstructions(
    comments,
    videoUrl,
    creatorId
  );
  const model = getGenerativeModel(systemInstructions) as AnalysisModel;

  const analysisModel = await addAnalysisTasksToModel(model);
  if (calledFrom === "search page") {
    activeModels.set(`${creatorId}-${videoId}`, model);
    return "Model created successfully"
  }

  return analysisModel;
}

export async function getModel(videoId: string, creatorId: string=DEFAULT_CREATOR_ID) {
  if (activeModels.has(`${creatorId}-${videoId}`)) {
    return activeModels.get(`${creatorId}-${videoId}`) as AnalysisModel;
  }
  const model = await createModel(videoId, "getModel",creatorId) as AnalysisModel;
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
