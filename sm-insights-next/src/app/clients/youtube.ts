import { google } from "googleapis";

const API_KEY = process.env.YOUTUBE_API_KEY;

export const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});
