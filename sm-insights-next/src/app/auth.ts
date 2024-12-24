import NextAuth from "next-auth";
import Instagram from "next-auth/providers/instagram";
// import Facebook from "next-auth/providers/facebook";

import {
  // OAUTH_FACEBOOK_URL,
  // OAUTH_FACEBOOK_REDIRECT_URI,
  // OAUTH_FACEBOOK_SCOPE,
  OAUTH_INSTAGRAM_REDIRECT_URI,
  OAUTH_INSTAGRAM_SCOPE,
  OAUTH_INSTAGRAM_URL,
} from "@/app/constants";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Instagram({
      clientId: process.env.AUTH_INSTAGRAM_ID_LOGIN,
      clientSecret: process.env.AUTH_INSTAGRAM_SECRET_LOGIN,
      authorization: {
        url: OAUTH_INSTAGRAM_URL,
        params: {
          scope: OAUTH_INSTAGRAM_SCOPE,
          redirect_uri:
            // "https://hardy-legally-crayfish.ngrok-free.app/api/auth/callback/instagram",
            OAUTH_INSTAGRAM_REDIRECT_URI,
        },
      },
    }),
    // Facebook({
    //   clientId: process.env.AUTH_FACEBOOK_ID,
    //   clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    //   authorization: {
    //     url: OAUTH_FACEBOOK_URL,
    //     params: {
    //       scope: OAUTH_FACEBOOK_SCOPE,
    //       redirect_uri: OAUTH_FACEBOOK_REDIRECT_URI,
    //       display: "pag",
    //       extras: { setup: { channel: "IG_API_ONBOARDING" } },
    //       response_type: "token",
    //     },
    //   },
    // }),
  ],
});

export interface UserData {
  id: string;
  username: string;
  user_id: string;
  name: string;
  profile_picture_url: string;
  accessToken: string;
}

export async function getUser() {
  const cookiesStore = await cookies();

  const userDataCookie = cookiesStore.get("userData");

  if (!userDataCookie) return null;

  return JSON.parse(userDataCookie.value) as UserData;
}
