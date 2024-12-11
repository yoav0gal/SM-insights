import type { NextRequest } from "next/server";
import { NextResponse, NextResponse as Response } from "next/server";
import { MY_PROFILE_PATH, OAUTH_INSTAGRAM_REDIRECT_URI } from "@/app/constants";
import { cookies } from "next/headers";
// import { signIn } from "@/app/auth.ts";
import { getInstagramUser } from "@/app/lib/instagram";

interface ShortLivedTokenResponse {
  access_token: string;
  user_id: number;
  permissions: string[];
}

interface LongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface UserBasicData {
  id?: string;
  user_id?: string;
  username?: string;
  name?: string;
  profile_picture_url?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    const reason = searchParams.get("error_reason");
    const description = searchParams.get("error_description");
    return Response.json({ error, reason, description }, { status: 400 });
  }

  if (!code) {
    return Response.json(
      { message: "Authorization code is required" },
      { status: 400 }
    );
  }

  const formData = new FormData();
  formData.append("client_id", String(process.env.AUTH_INSTAGRAM_ID_LOGIN)); // Replace with your app ID
  formData.append(
    "client_secret",
    process.env.AUTH_INSTAGRAM_SECRET_LOGIN as string
  ); // Replace with your app secret
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", OAUTH_INSTAGRAM_REDIRECT_URI); // Replace with your redirect URI
  formData.append("code", code); // Replace with the authorization code

  try {
    const shortLivedTokenResponse = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        body: formData,
      }
    );

    const shortLivedTokenData: ShortLivedTokenResponse =
      await shortLivedTokenResponse.json();

    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?${new URLSearchParams({
        grant_type: "ig_exchange_token",
        client_secret: String(process.env.AUTH_INSTAGRAM_SECRET_LOGIN),
        access_token: shortLivedTokenData.access_token,
      })}`,
      {
        method: "GET",
      }
    );

    const longLivedTokenResponseData: LongLivedTokenResponse =
      await longLivedTokenResponse.json();

    const userProfileData = await getInstagramUser(
      longLivedTokenResponseData.access_token
    );

    const cookiesStore = await cookies();

    cookiesStore.set({
      name: "userData",
      httpOnly: true,
      secure: true,
      value: JSON.stringify({
        ...userProfileData,
        accessToken: longLivedTokenResponseData.access_token,
      }),
    });

    // response.redirect("https://localhost:3000");
    return NextResponse.redirect(MY_PROFILE_PATH);
  } catch (error: unknown) {
    console.log(error);
    return Response.json({ error: error }, { status: 400 });
  }
}
