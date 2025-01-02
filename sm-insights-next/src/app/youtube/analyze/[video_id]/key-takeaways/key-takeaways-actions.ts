"use server";
import { getModel } from "../analysis";
import { DEFAULT_CREATOR_ID } from "../youtube-analysis-constants";

export async function getKeyTakeaways(videoId: string) {
  //TODO get video id and creator id from the request (or in a different way)
  const model = await getModel(videoId, DEFAULT_CREATOR_ID);

  const keyTakeaways = await model.keyTakeaways();

  return keyTakeaways;
}
