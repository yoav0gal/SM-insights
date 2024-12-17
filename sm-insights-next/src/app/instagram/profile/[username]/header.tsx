import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { UserDropdown } from "./user-dropdown";

interface HeaderProps {
  userProfileUrl: string;
}

export function Header({ userProfileUrl }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 shadow-sm">
      <Link className="flex items-center justify-center" href="#">
        <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <span className="ml-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
          AudieLens
        </span>
      </Link>
      <div className="ml-auto">
        <UserDropdown userProfileUrl={userProfileUrl} />
      </div>
    </header>
  );
}
