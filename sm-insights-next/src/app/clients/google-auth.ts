import { google } from "googleapis";
import { OAUTH_GOOGLE_REDIRECT_URI } from "../constants";

export const googleOAuth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    OAUTH_GOOGLE_REDIRECT_URI
)

const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
];

export const googleAuthUrl = googleOAuth2Client.generateAuthUrl({
    scope: scopes
})

console.log({googleAuthUrl})