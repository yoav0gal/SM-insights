export const OAUTH_INSTAGRAM_URL = `https://api.instagram.com/oauth/authorize`;
export const OAUTH_INSTAGRAM_REDIRECT_URI = `${
  process.env.NEXTAUTH_URL ?? `https://smfront.vercel.app`
}${false ? "/api/auth/callback/instagram" : "/api/completelogin"}`;

// auth / callback / instagram;
export const OAUTH_INSTAGRAM_SCOPE = `instagram_business_basic,instagram_business_basic,business_manage_comments,business_content_publish,business_manage_messages,instagram_business_manage_comments`;
export const DOMAIN = `${process.env.DOMAIN}`;

export const FACEBOOK_API_VERSION = "v21.0";
export const OAUTH_FACEBOOK_URL = `https://www.facebook.com/dialog/oauth`;

export const OAUTH_FACEBOOK_SCOPE = `instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`;

export const OAUTH_FACEBOOK_REDIRECT_URI = `${
  process.env.NEXTAUTH_URL ?? `https://smfront.vercel.app`
}${false ? "/api/auth/callback/instagram" : "/facebook"}`;

export const OAUTH_FACEBOOK_COMPLETE_LOGIN_PATH = `${process.env.NEXTAUTH_URL}/api/facebook-login`;
