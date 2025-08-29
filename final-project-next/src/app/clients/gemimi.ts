import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemInstruction } from "./gemini-constants";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? "Add Your Gemini API key"
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: systemInstruction,
});

export default model;
