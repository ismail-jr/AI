"use client";

import Link from "next/link";
import { useAuth } from "../contexts/authcontext";
import { useChat } from "../contexts/chatcontext";
import {
  User,
  LogOut,
  PlusCircle,
  MessageSquare,
  MoreVertical,
  Trash2,
  BrainCircuit,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { pastQueries, startNewChat, setActiveChat, deleteQuery } = useChat();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[var(--accent-primary)] text-white shadow-lg hover:bg-[var(--accent-hover)] transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`w-72 h-full flex flex-col shadow-2xl sidebar fixed top-0 left-0 z-40 transition-transform duration-300 transform overflow-y-auto hide-scrollbar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center space-x-3 border-b border-[var(--border-light)]">
          <div className="p-2 bg-[var(--accent-soft)] rounded-lg">
            <BrainCircuit size={24} className="text-[var(--accent-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Guido
          </h2>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-[var(--border-light)]">
          <Link href="#" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-105 transition-transform">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--text-primary)] truncate">
                {user?.displayName || "AI User"}
              </p>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                {user?.email || "No Email"}
              </p>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation & Prompts */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <PlusCircle
              size={18}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            <span className="font-medium">New Chat</span>
          </button>

          {/* Past Prompts Section */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-2">
              Recent Chats
            </h3>
            <ul className="space-y-2">
              {pastQueries.length > 0 ? (
                pastQueries.map((query) => (
                  <li key={query.id} className="group relative">
                    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all duration-200 border border-[var(--border-light)]">
                      <button
                        onClick={() => {
                          setActiveChat(query.id ?? null);
                          setSidebarOpen(false);
                        }}
                        className="flex items-center space-x-3 flex-1 min-w-0 text-left"
                      >
                        <MessageSquare
                          size={16}
                          className="text-[var(--accent-primary)] flex-shrink-0"
                        />
                        <span className="text-sm text-[var(--text-primary)] truncate">
                          {query.content}
                        </span>
                      </button>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(
                              menuOpen === query.id ? null : query.id || null,
                            );
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                          aria-label="Chat options"
                        >
                          <MoreVertical
                            size={14}
                            className="text-[var(--text-tertiary)]"
                          />
                        </button>

                        {menuOpen === query.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg shadow-lg z-50 overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQuery(query.id!);
                                setMenuOpen(null);
                              }}
                              className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-[var(--text-tertiary)]">
                    No recent chats
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Start a new conversation
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-6 border-t border-[var(--border-light)]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-red-500 hover:text-white transition-all duration-200 border border-[var(--border-light)] hover:border-red-500 group"
          >
            <LogOut
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
            <span className="font-medium">Logout</span>
          </button>

          {/* App Version */}
          <p className="text-center text-xs text-[var(--text-tertiary)] mt-4">
            Version 1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
