export const OAUTH_INSTAGRAM_URL = `https://api.instagram.com/oauth/authorize`;
export const OAUTH_INSTAGRAM_REDIRECT_URI = `${
  process.env.NEXTAUTH_URL ?? `hhttps://smfront.vercel.app`
}${false ? "/api/auth/callback/instagram" : "/api/completelogin"}`;

// auth / callback / instagram;
export const OAUTH_INSTAGRAM_SCOPE = `instagram_business_basic,instagram_business_basic,business_manage_comments,business_content_publish,business_manage_messages,instagram_business_manage_comments`;
export const MY_PROFILE_PATH = `${process.env.DOMAIN}`;
