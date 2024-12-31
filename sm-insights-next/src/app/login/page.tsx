import { MessageCircle } from "lucide-react";
import { SSOButton } from "./sso-button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Link href={"/"} className="flex items-center justify-center mb-8">
            <MessageCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              AudieLens
            </h1>
          </Link>
          <div className="space-y-4">
            <SSOButton provider="instagram" />
            <SSOButton provider="google" />
            <SSOButton provider="youtube" />
          </div>
        </div>
      </main>
    </div>
  );
}
