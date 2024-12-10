import NextAuth from "next-auth";
import Instagram from "next-auth/providers/instagram";
import Facebook from "next-auth/providers/facebook";
import {
  OAUTH_INSTAGRAM_REDIRECT_URI,
  OAUTH_INSTAGRAM_SCOPE,
  OAUTH_INSTAGRAM_URL,
} from "@/app/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  debug: true,
  //   logger: {
  //     error(code, ...message) {
  //       console.error(code, message);
  //     },
  //     warn(code, ...message) {
  //       console.warn(code, message);
  //     },
  //     debug(code, ...message) {
  //       console.log(code, message);
  //     },
  //   },

  providers: [
    Instagram({
      clientId: process.env.AUTH_INSTAGRAM_ID,
      clientSecret: process.env.AUTH_INSTAGRAM_SECRET,
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
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("here!");
      console.log({ session, token }); // Add user id to the session
      return session;
    },
  },
});
