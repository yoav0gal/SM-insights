import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/app/auth";
// export { auth as middleware } from "@/app/auth";

export async function middleware([request, response]: [
  NextApiRequest,
  NextApiResponse
]) {
  console.log(request);
  const session = await auth(request, response);
  console.log(session);
}
