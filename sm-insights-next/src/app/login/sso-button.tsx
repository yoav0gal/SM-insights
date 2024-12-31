import Link from "next/link";
import Image from "next/image";
import { FULL_INSTAGRAM_OAUTH_URL } from "../constants";

interface SSOButtonProps {
  provider: "instagram" | "google" | "youtube";
}

export function SSOButton({ provider }: SSOButtonProps) {
  const getProviderDetails = (provider: SSOButtonProps["provider"]) => {
    switch (provider) {
      case "instagram":
        return {
          name: "Instagram",
          logo: "/instagram.svg",
          redirect_uri: FULL_INSTAGRAM_OAUTH_URL.href,
        };
      case "google":
        return {
          name: "Google",
          logo: "/google.svg",
          redirect_uri: "/youtube/find-video",
        };
      case "youtube":
        return {
          name: "YouTube",
          logo: "/youtube.svg",
          redirect_uri: "/youtube/find-video",
        };
    }
  };

  const { name, logo, redirect_uri } = getProviderDetails(provider);

  return (
    <Link
      href={redirect_uri}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        width={20}
        height={20}
        className="mr-2"
      />
      Continue with {name}
    </Link>
  );
}
