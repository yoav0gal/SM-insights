export const OAUTH_INSTAGRAM_URL = `https://api.instagram.com/oauth/authorize`;
export const OAUTH_INSTAGRAM_REDIRECT_URI = `${
  process.env.NEXTAUTH_URL ?? `https://smfront-yoav0gals-projects.vercel.app`
}/api/auth/callback/instagram`;
export const OAUTH_INSTAGRAM_SCOPE = `instagram_business_basic`;
