"use client";
import { useEffect } from "react";
// import { OAUTH_FACEBOOK_COMPLETE_LOGIN_PATH } from "@/app/constants";

function PageUrlReplacer() {
  useEffect(() => {
    if (typeof window == "undefined") return;
    const currentUrl = window.location.href;

    // Check if the URL contains a hash
    if (currentUrl.includes("#")) {
      // Split the URL into the base and the hash part
      const [, hashParams] = currentUrl.split("#");

      // Create the new URL with the hash converted to query params
      const newUrl = `${window.location.origin}/api/facebook-login?${hashParams}`;

      // Update the browser's URL without reloading the page
      window.history.pushState(null, "", newUrl);
    }
  }, []);

  return (
    <>
      <h1>loading...</h1>
    </>
  );
}

export default function page() {
  return (
    <>
      <PageUrlReplacer />
    </>
  );
}
