import { getUser } from "@/app/auth";
import { Header } from "@/app/instagram/profile/[username]/header";
import { CommentList } from "./comment-list";

interface Comment {
  id: string;
  text: string;
  from: { id: string; username: string };
  like_count: number;
}

async function getAllComments(media_id: string) {
  "use server";

  const userData = await getUser();

  if (!userData) throw new Error("User not logged in!");

  const url = new URL(`https://graph.instagram.com/${media_id}/comments`);
  const fields = "id,text, from, like_count";
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", userData?.accessToken);

  try {
    const response = await fetch(url);
    const comments = (await response.json())?.data as Comment[];
    return comments;
  } catch (error) {
    console.error(
      (error as any as Error).message,
      (error as any as Error).stack
    );
    throw error;
  }
}

export default async function AnalyzePostPage({
  params,
}: {
  params: Promise<{ media_id: string }>;
}) {
  const media_id = (await params)?.media_id;

  const user = await getUser();
  const comments = await getAllComments(media_id);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header userProfileUrl={user.profile_picture_url} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400">
          Analyze Post
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Comments for Post {media_id}
          </h2>
          <CommentList comments={comments} />
        </div>
      </main>
    </div>
  );
}
