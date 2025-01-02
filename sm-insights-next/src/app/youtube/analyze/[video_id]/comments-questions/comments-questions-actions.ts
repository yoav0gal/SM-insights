"use server";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";
export async function askCommentsQuestion(videoId: string, query: string) {
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const answer = await model.deepDive(query);

  return answer;
}
