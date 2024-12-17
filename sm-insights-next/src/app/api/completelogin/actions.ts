"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  // Remove the user data cookie
  const cookieStorage = await cookies();
  cookieStorage.delete("userData");

  redirect("/");
}
