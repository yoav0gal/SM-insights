import { redirect } from "next/navigation";
import { Header } from "./header";
import { PhotoGrid } from "./photo-grid";
import { getUser } from "@/app/auth";
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
  url.searchParams.set("limit", "12");

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Instagram posts");
  }
}

export default async function InstagramProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUser();

  if (!user) redirect("/");

  const userPageData = (await getUserPageData())?.data ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header userProfileUrl={user.profile_picture_url} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
            {user.profile_picture_url ? (
              <Image
                src={user.profile_picture_url}
                alt={user.name}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">{user.name[0]}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Which post would you like to analyze?
        </h2>
        <PhotoGrid
          photos={userPageData.map((image: any, index: number) => ({
            ...image,
            comment_count: index + 5,
          }))}
        />
      </main>
    </div>
  );
}
