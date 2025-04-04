import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  homeUrl?: string;
}

export function Header({ homeUrl }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 shadow-sm">
      <Link className="flex items-center justify-center" href={homeUrl ?? "/"}>
        <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <span className="ml-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
          AudieLens
        </span>
      </Link>
      <div className="ml-auto">{/* Something on the right top corner */}</div>
    </header>
  );
}
