import { getUser } from "../auth";
import Image from "next/image";

async function getUserPageData() {
  "use server";

  const userData = await getUser();

  if (!userData) throw new Error("User not logged in!");

  const fields =
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username";

  const url = new URL(`https://graph.instagram.com/${userData.user_id}/media`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", userData?.accessToken);
  url.searchParams.set("limit", "10");

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Instagram posts");
  }
}

export async function UserPage() {
  const userPageData = await getUserPageData();

  const pagePosts = userPageData.data as any[];

  console.log(userPageData);
  return (
    <>
      <h1>this is my userPage</h1>

      {pagePosts.map(({ id, media_url }) => (
        <Image
          alt="funny-post"
          src={media_url as string}
          key={id}
          width={200}
          height={200}
        />
      ))}
    </>
  );
}
