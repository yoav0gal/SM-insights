import {NextRequest, NextResponse } from "next/server";
import { googleOAuth2Client } from "@/app/clients/google-auth";

export async function GET(req: NextRequest, res: NextRequest) {

  return NextResponse.json("google-login!");
}
