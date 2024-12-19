import { getUser } from "@/app/auth";

async function getAllComments(media_id: string) {
  "use server";

  const userData = await getUser();

  if (!userData) throw new Error("User not logged in!");


  const url = new URL(`https://graph.instagram.com/${media_id}/comments`);
  const fields =
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,text,statistics,lang";
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", userData?.accessToken);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error((error as any as Error).message, (error as any as Error).stack)
  }

}

export default async function Page({
  params,
}: {
  params: Promise<{ media_id: string }>;
}) {
  const media_id = (await params)?.media_id;

  const comments = await getAllComments(media_id);

  console.log(comments);

  return <p>Post: {media_id}</p>;
}
