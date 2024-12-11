import Image from "next/image";
import { getUser } from "@/app/auth";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server Action
async function logout() {
  "use server";

  // Remove the user data cookie
  const cookieStorage = await cookies();
  cookieStorage.delete("userData");

  redirect("/");
}

export async function UpperBanner() {
  const userData = await getUser();

  if (!userData) {
    return (
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/api/auth/signin"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 flex items-center space-x-4 rounded-lg shadow-md">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-700">
        <Image
          src={userData.profile_picture_url}
          alt="Profile Picture"
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h2 className="text-white text-2xl font-bold">{userData.name}</h2>
      </div>
      <button
        onClick={logout}
        className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
        aria-label="Logout"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}
