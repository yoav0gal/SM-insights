"use server";

import { ModelService } from "./model-service";
import type { ClusterData } from "./comments-cluster-tabs";

export async function getLLMClusters(videoId: string): Promise<ClusterData[]> {
  const service = new ModelService(videoId);
  await service.init();
  return await service.clusterCommentsHierarchical();
}

export async function initDeepSTC(videoId: string) {
  const service = new ModelService(videoId);
  return await service.initDeepSTC();
}

export async function checkDeepSTCStatus(videoId: string) {
  const service = new ModelService(videoId);
  await service.init(); // required if fallback to LLM is needed
  return await service.checkDeepSTCStatus();
}
