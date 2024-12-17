import { getUser } from "@/app/auth";

async function getAllComments(media_id: string) {
  "use server";

  const userData = await getUser();

  if (!userData) throw new Error("User not logged in!");

  // const fields =
  //   "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username";

  const url = new URL(`https://graph.instagram.com/${media_id}/comments`);
  // url.searchParams.set("fields", fields);
  // url.searchParams.set("access_token", userData?.accessToken);
  // url.searchParams.set("limit", "10");

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Instagram posts");
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ media_id: string }>;
}) {
  const media_id = (await params)?.media_id ?? "18013361653457648";

  // const comments = await getAllComments(media_id);

  // console.log(comments);

  return <p>Post: {media_id}</p>;
}
