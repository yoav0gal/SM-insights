"use server";

import { Comment } from "./recommended-comments";
import gemini from "@/app/clients/gemimi";

export async function searchComments(comments: Comment[], query: string) {
  const prompt = `
    The following is this post comments list:
    ${JSON.stringify(comments ?? [])} \n
    from this comment list find all comments related to in any way, ${query}

    `;

  console.log(prompt);

  const result = await gemini.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return formatGeminiResponse(text);
}

function formatGeminiResponse(responseText: string) {
  if (responseText.startsWith("```json") && responseText.endsWith("```\n")) {
    return JSON.parse(responseText.slice(7, -4));
  }
  return JSON.parse(responseText);
}
