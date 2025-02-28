"use client";

import Link from "next/link";
import { useAuth } from "../contexts/authcontext";
import { useChat } from "../contexts/chatcontext"; // ✅ Import chat context
import {
  User,
  Cpu,
  LogOut,
  Settings,
  PlusCircle,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth(); // ✅ Get user & logout function
  const { pastQueries, startNewChat, setActiveChat } = useChat(); // ✅ Fetch past queries & new chat function

  return (
    <aside className="w-72 sidebar h-screen flex flex-col shadow-2xl bg-gray-900 text-white">
      {/* 🔹 Sidebar Header */}
      <div className="p-4 flex items-center space-x-2 border-b border-gray-700">
        <Cpu size={24} className="text-blue-500" />
        <h2 className="text-lg font-semibold">Guido</h2>
      </div>

      {/* 🔹 User Profile Section */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
        <Link href="/profile" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
            <User size={24} />
          </div>
          <div>
            <p className="font-medium">{user?.displayName || "AI User"}</p>
            <p className="text-gray-400 text-sm">{user?.email || "No Email"}</p>
          </div>
        </Link>
      </div>

      {/* 🔹 Sidebar Navigation & Prompts */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 🔹 Start New Chat Button */}
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>

        {/* 🔹 Past Prompts */}
        <div>
          <h3 className="text-sm text-gray-400 mt-4 mb-2">Past Prompts</h3>
          <ul className="space-y-2 overflow-y-auto max-h-52">
            {pastQueries.length > 0 ? (
              pastQueries.map((query, index) => (
                <li
                  key={index}
                  onClick={() => setActiveChat(query)} // ✅ Load past query into chat
                  className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md text-sm cursor-pointer hover:bg-gray-700 transition"
                >
                  <MessageSquare size={16} className="text-blue-400" />
                  <span className="truncate max-w-[180px]">
                    {query.content}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No past prompts</p>
            )}
          </ul>
        </div>
      </div>

      {/* 🔹 Settings & Logout (Pinned at Bottom) */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/settings"
          className="flex items-center space-x-2 p-3 hover:bg-gray-800 rounded-md transition"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 mt-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
