interface InstagramUser {
  id: string;
  username: string;
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
