interface InstagramUser {
  id: string;
  username: string;
  user_id: string;
  name: string;
  profile_picture_url: string;
}

export async function getInstagramUser(
  accessToken: string
): Promise<InstagramUser | null> {
  const url = new URL("https://graph.instagram.com/v21.0/me");
  url.searchParams.set(
    "fields",
    "id,username,user_id,name,profile_picture_url"
  );
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram user data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Instagram user:", error);
    throw error;
  }
}

export async function refreshAccessToken(
  accessToken: string
): Promise<InstagramUser | null> {
  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Instagram user:", error);
    throw error;
  }
}
