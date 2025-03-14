"use client"; // Ensure this is at the top

import { useAuth } from "@/contexts/authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BookCopy,
  BrainCircuit,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  NotebookPen,
} from "lucide-react";
import Footer from "@/components/footer";

const Homepage = () => {
  const { user, loading, signUpWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Fixed: Name state is properly managed
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Sign In
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err instanceof Error && "code" in err) {
        const errorCode = (err as { code: string }).code;
        switch (errorCode) {
          case "auth/email-already-in-use":
            errorMessage =
              "This email is already registered. Try signing in instead.";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/weak-password":
            errorMessage =
              "Your password is too weak. Use at least 6 characters.";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email. Sign up first!";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error! Check your internet connection and try again.";
            break;
          default:
            errorMessage = "Invalid Credentials.";
        }
      }

      setError(errorMessage);
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
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-sky-500 to-black px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full pt-24">
          {/* 🔹 Left Section - Banners */}
          <div className="pb-10">
            <div className="flex flex-row items-center space-x-3">
              <h1 className="text-4xl font-bold text-gray-300">
                Welcome to Guido
              </h1>
              <BrainCircuit className="w-10 h-10 text-white" />
            </div>

            <p className="text-gray-200 mt-2 text-lg">
              Your AI-powered career mentor, guiding you towards the right path.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-gray-800 text-gray-200 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <Activity />
                  <h3 className="font-bold"> Career Guidance</h3>
                </div>

                <p className="text-md text-gray-300">
                  Get personalized career advice based on your interests.
                </p>
              </div>
              <div className="p-4 bg-gray-800 text-gray-200 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <ChartNoAxesCombined />
                  <h3 className="font-bold"> Job Market Insights</h3>
                </div>
                <p className="text-md text-gray-300">
                  Discover industry trends and top-demand careers.
                </p>
              </div>
              <div className="p-4 bg-gray-800 text-gray-200 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <BookCopy />
                  <h3 className="font-bold">Training & Courses</h3>
                </div>
                <p className="text-md text-gray-300">
                  Find the best courses to upskill in your chosen field.
                </p>
              </div>
              <div className="p-4 bg-gray-800 text-gray-200 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <NotebookPen />
                  <h3 className="font-bold"> Resume & Interviews</h3>
                </div>
                <p className="text-md text-gray-300">
                  Get tips on resume building and interview preparation.
                </p>
              </div>
            </div>
          </div>

          {/* 🔹 Right Section - Authentication Form */}
          <div className="pb-6">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-600">
                {isSignUp ? "Create an Account" : "Sign In to Your Account"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <input
                    type="text"
                    placeholder="Jibriel Ismail"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 text-gray-400 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 text-gray-400 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 text-gray-400 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              <p className="mt-4 text-gray-600">
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}

      <Footer />
    </div>
  );
};

export default Homepage;
