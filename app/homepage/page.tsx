"use client"; // Ensure this is at the top

import { useAuth } from "@/contexts/authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const { user, loading, signUpWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Fixed: Name state is properly managed
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Sign In
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      if (isSignUp) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      setError(error.message); // Display error message
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && ( // Show name input only for sign-up
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <p className="mt-4 text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Homepage;
