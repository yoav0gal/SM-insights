"use server";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";

//TODO: try to fix recommended comments not all changing
export async function recommendComments(videoId: string) {
  //TODO get video id and creator id from the request (or in a different way)
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const recommendations = await model.recommendations();

  return recommendations;
}
