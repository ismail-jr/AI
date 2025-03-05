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
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { pastQueries, startNewChat, setActiveChat, deleteQuery } = useChat();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state

  return (
    <>
      {/* 🔹 Chevron Button for Small Screens */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-3 fixed top-2 z-50  rounded-md text-white"
      >
        {sidebarOpen ? (
          <X size={20} className="bg-slate-900" />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {/* 🔹 Sidebar */}
      <aside
        className={`w-72 h-screen flex flex-col shadow-2xl sidebar fixed top-0 left-0 z-40 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* 🔹 Sidebar Header */}
        <div className="p-4 flex items-center justify-center space-x-2 border-b border-gray-700">
          <BrainCircuit size={24} className="text-blue-500" />
          <h2 className="text-lg font-semibold">Guido</h2>
        </div>

        {/* 🔹 User Profile Section */}
        <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
          <Link href="#" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
              <User size={24} />
            </div>
            <div>
              <p className="font-medium">{user?.displayName || "AI User"}</p>
              <p className="text-gray-400 text-sm">
                {user?.email || "No Email"}
              </p>
            </div>
          </Link>
        </div>

        {/* 🔹 Sidebar Navigation & Prompts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <PlusCircle size={18} />
            <span>New Chat</span>
          </button>

          <div>
            <h3 className="text-sm text-gray-400 mt-4 mb-2">Past Prompts</h3>
            <ul className="space-y-2 overflow-y-auto max-h-52">
              {pastQueries.length > 0 ? (
                pastQueries.map((query) => (
                  <li
                    key={query.id}
                    className="flex justify-between items-center p-2 bg-gray-800 rounded-md text-sm cursor-pointer hover:bg-gray-700 transition relative"
                  >
                    <div
                      onClick={() => setActiveChat(query.id ?? null)}
                      className="flex items-center space-x-2 flex-1"
                    >
                      <MessageSquare size={16} className="text-blue-400" />
                      <span className="truncate max-w-[150px]">
                        {query.content}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === query.id ? null : query.id || null
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-700"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuOpen === query.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              deleteQuery(query.id!);
                              setMenuOpen(null);
                            }}
                            className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-700 transition"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No past prompts</p>
              )}
            </ul>
          </div>
        </div>

        {/* 🔹 Settings & Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 mt-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
