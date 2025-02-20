//Main page/ page.ts

"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Homepage from "./homepage/page";
import ChatPage from "./chat/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect to welcome page if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/homepage"); // Redirect to the welcome page
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while checking auth state
  }

  // If user is authenticated, show the chat page
  if (user) {
    return <ChatPage />;
  }

  // If user is not authenticated, show the welcome page
  return <Homepage />;
}
