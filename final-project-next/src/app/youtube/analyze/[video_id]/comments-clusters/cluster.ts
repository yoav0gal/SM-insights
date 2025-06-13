"use server";

import { ModelService } from "./model-service";
import type { ClusterData } from "./comments-cluster-tabs";

export async function getLLMClusters(videoId: string): Promise<ClusterData[]> {
  const service = new ModelService(videoId);
  await service.init();
  return await service.clusterCommentsHierarchical();
}
