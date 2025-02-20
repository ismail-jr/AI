"use client";

import ChatInput from "@/components/chatinput";
import MessageBubble from "@/components/messagebubble";
import { useChat } from "@/contexts/chatcontext";
import { useAuth } from "@/contexts/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, User, Bot, Menu } from "lucide-react";
import Sidebar from "@/components/sidebar"; //+

const ChatPage = () => {
  const { messages } = useChat();
  const { logout, user } = useAuth();
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={24} className="text-blue-500" />{" "}
              {/* AI Chatbot Icon */}
              <h1 className="text-xl font-bold text-gray-800">AI Chat</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User size={20} /> {/* User Icon */}
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white flex items-center py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
          </div>

          {/* Chat Input */}
          <div className="bg-white p-4 border-t border-gray-200">
            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
