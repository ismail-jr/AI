"use client";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Auth() {
  const [user] = useAuthState(auth);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signInWithGitHub = () => signInWithPopup(auth, githubProvider);

  return (
    <div className="p-4 text-center">
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button
            onClick={() => signOut(auth)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign in with Google
          </button>
          <button
            onClick={signInWithGitHub}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Sign in with GitHub
          </button>
        </div>
      )}
    </div>
  );
}
