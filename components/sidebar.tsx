"use client";

import Link from "next/link";
import { User } from "firebase/auth";
import {
  MessageCircle,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
        <MessageCircle size={24} className="text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Chat App</h2>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
          <UserIcon size={20} />
        </div>
        <div>
          <p className="text-gray-800 font-medium">
            {user?.displayName || "User"}
          </p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/chat"
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-300"
            >
              <MessageCircle size={18} />
              <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-300"
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-300"
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
