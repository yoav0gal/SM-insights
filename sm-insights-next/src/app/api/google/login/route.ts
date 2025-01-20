import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/clients/supabase";

export async function GET(request: NextRequest) {
  const { data, error } = await supabase.from("Users").select("*");

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data:", data);
  }

  return NextResponse.json(data);
}
