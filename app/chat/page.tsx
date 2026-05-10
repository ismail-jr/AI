"use client";

import ChatInput from "@/components/chatinput";
import MessageBubble from "@/components/messagebubble";
import { useChat } from "@/contexts/chatcontext";
import { useAuth } from "@/contexts/authcontext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/sidebar";
import { Menu, Users, Info, Wifi, WifiOff } from "lucide-react";

const ChatPage = () => {
  const { messages, loading: chatLoading } = useChat();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle authentication state
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsRedirecting(true);
      router.push("/homepage");
    } else {
      setIsRedirecting(false);
    }
  }, [user, authLoading, router]);

  // Handle online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading state
  if (authLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center animate-pulse">
              <span className="text-3xl font-bold text-[var(--accent-primary)]">
                G
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4">
              <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              {isRedirecting ? "See you soon! 👋" : "Welcome back! 🌟"}
            </h3>
            <p className="text-[var(--text-secondary)]">
              {isRedirecting
                ? "Redirecting to login..."
                : "Preparing your chat experience..."}
            </p>
          </div>

          {/* Loading Bar */}
          <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent-primary)] rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with responsive positioning */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto overflow-hidden bg-[var(--bg-primary)]">
        {/* Chat Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-[var(--text-primary)]" />
            </button>

            {/* Online Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Header Title */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Users size={16} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">
                AI Assistant
              </span>
            </div>

            {/* Info Button */}
            <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group relative">
              <Info
                size={18}
                className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
              />

              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs text-[var(--text-secondary)] z-50">
                Powered by advanced AI to assist with your career journey.
                Responses may take a few seconds.
              </div>
            </button>
          </div>
        </header>

        {/* Welcome Message for Empty Chat */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Animated Icon */}
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-24 h-24 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                  <span className="text-4xl font-bold text-[var(--accent-primary)]">
                    G
                  </span>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Welcome to Guido
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Your AI-powered career mentor. Ask me anything about your
                  career journey, from resume tips to interview preparation.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Career Advice",
                  "Resume Help",
                  "Interview Prep",
                  "Skill Development",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-full text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-default"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MessageBubble
                message={msg}
                isThinking={chatLoading && index === messages.length - 1}
              />
            </div>
          ))}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
          <ChatInput />
        </div>

        {/* Offline Banner */}
        {!isOnline && (
          <div className="sticky bottom-0 left-0 right-0 bg-rose-500/90 backdrop-blur-sm text-white py-2 px-4 text-center text-sm flex items-center justify-center gap-2 animate-in slide-in-from-bottom">
            <WifiOff size={16} />
            <span>
              You're offline. Messages will send when connection is restored.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
