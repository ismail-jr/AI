"use client";

import { useAuth } from "@/contexts/authcontext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookCopy,
  Eye,
  EyeOff,
  NotebookPen,
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/footer";
import Image from "next/image";

const Homepage = () => {
  const {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithGithub,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If user is authenticated and we're on homepage, redirect to chat
    if (user && !loading && window.location.pathname === "/homepage") {
      window.location.href = "/chat"; // Force a hard redirect
    }
  }, [user, loading]);

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

  const handleGoogleSignIn = async () => {
    try {
      setIsRedirecting(true);
      setError(null);
      await signInWithGoogle();
      // The page will redirect, so we don't need to do anything else
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsRedirecting(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsRedirecting(true);
      setError(null);
      await signInWithGithub();
      // The page will redirect, so we don't need to do anything else
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
      setIsRedirecting(false);
    }
  };

  // Show loading state
  if (loading || isRedirecting || user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="loading-spinner mb-4"></div>
        <p className="text-[var(--text-secondary)]">
          {isRedirecting ? "Redirecting to authentication..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)] via-transparent to-transparent opacity-50"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--accent-primary)] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[var(--accent-primary)] rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full">
            {/* Left Section - Hero Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-soft)] rounded-full">
                <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm font-medium text-[var(--accent-primary)]">
                  AI-Powered Career Guidance
                </span>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight">
                  Welcome to{" "}
                  <span className="text-[var(--accent-primary)]">Guido</span>
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-xl">
                  Your AI-powered career mentor, guiding you towards the right
                  path with personalized insights and expert recommendations.
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    10K+
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    95%
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Success Rate
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    24/7
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    AI Support
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card group hover:border-[var(--accent-primary)] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--accent-soft)] rounded-lg group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        Career Guidance
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Personalized advice based on your interests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card group hover:border-[var(--accent-primary)] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--accent-soft)] rounded-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        Job Market Insights
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Industry trends and in-demand careers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card group hover:border-[var(--accent-primary)] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--accent-soft)] rounded-lg group-hover:scale-110 transition-transform">
                      <BookCopy className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        Training & Courses
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Best courses to upskill in your field
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card group hover:border-[var(--accent-primary)] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--accent-soft)] rounded-lg group-hover:scale-110 transition-transform">
                      <NotebookPen className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        Resume & Interviews
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Tips for resume building and interviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Secure & Private
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Instant Responses
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Authentication Form */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="card p-8 border-2 hover:border-[var(--accent-primary)] transition-all duration-300">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-soft)] rounded-full mb-4">
                      <Image
                        src="/logo.png"
                        alt="Guido Logo"
                        width={50}
                        height={30}
                        className=" rounded-xl"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                      {isSignUp ? "Create an Account" : "Welcome Back"}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                      {isSignUp
                        ? "Start your career journey with Guido"
                        : "Sign in to continue your journey"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 group"
                    >
                      <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-light)]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-tertiary)]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isRedirecting}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Google
                      </span>
                    </button>

                    <button
                      onClick={handleGithubSignIn}
                      disabled={isRedirecting}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.58 0-.29-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.39-1.335-1.76-1.335-1.76-1.09-.746.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.306.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.32 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.55 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.1.824 2.22 0 1.6-.015 2.89-.015 3.28 0 .32.216.7.83.58C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        GitHub
                      </span>
                    </button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {isSignUp
                        ? "Already have an account?"
                        : "Don't have an account?"}
                      <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-[var(--accent-primary)] hover:underline font-medium"
                      >
                        {isSignUp ? "Sign In" : "Sign Up"}
                      </button>
                    </p>
                  </div>

                  {/* Social Proof */}
                  <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                    <p className="text-xs text-center text-[var(--text-tertiary)]">
                      Trusted by students from top universities worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
