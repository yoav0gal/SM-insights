export const DOMAIN = `${process.env.DOMAIN}`;
export const STC_BACKEND_BASE_URL = `${
  process.env.STC_BACKEND_BASE_URL || "http://localhost:8000"
}`;

export const YOUTUBE_DEFAULT_COMMENTS_LIMIT = 200;
export const USE_YOUTUBE_API_MOCKS = Boolean(
  process.env.USE_MOCK_YOUTUBE_DATA === "true"
);
console.log(USE_YOUTUBE_API_MOCKS ? "using mocks" : " using real data");

type GeminiModel = "gemini-2.0-flash" | "gemini-2.0-flash-lite";
export const GEMINI_MODEL = (process.env.GEMINI_MODEL ??
  "gemini-2.0-flash-lite") as GeminiModel;
console.log(`Using Gemini model: ${GEMINI_MODEL}`);
