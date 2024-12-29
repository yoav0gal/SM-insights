import { NextRequest, NextResponse } from "next/server";
import { getTextEmbedding } from "@/app/STC/modernBert";

export async function GET(request: NextRequest) {
  const text = "Your input text goes here.";
  const embedding = await getTextEmbedding(text);
  // console.log(embedding);
  console.log(embedding.shape);

  return NextResponse.json(embedding.shape);
}
