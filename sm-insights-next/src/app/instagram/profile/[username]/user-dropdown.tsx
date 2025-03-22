"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { logout } from "@/app/api/completelogin/actions";

interface UserDropdownProps {
  userProfileUrl: string;
}

export function UserDropdown({ userProfileUrl }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none group-hover:ring-2 group-hover:ring-purple-500 rounded-full transition-all duration-200"
      >
        <Image
          src={userProfileUrl}
          alt="User profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-full" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
