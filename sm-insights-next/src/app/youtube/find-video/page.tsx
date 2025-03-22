import { Header } from "@/app/components/header";
import { YouTubeSearch } from "./youtube-search";

export default function FindYouTubePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <YouTubeSearch />
      </main>
    </div>
  );
}
