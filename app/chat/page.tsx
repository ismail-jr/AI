"use client";

import ChatInput from "@/components/chatinput";
import MessageBubble from "@/components/messagebubble";
import { useChat } from "@/contexts/chatcontext";
import { useAuth } from "@/contexts/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar"; //+

const ChatPage = () => {
  const { messages, loading } = useChat();
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      <div className="flex h-screen chat-page-bg">
        <Sidebar />
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {/*  */}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                isThinking={loading && index === messages.length - 1} // ✅ Show spinner for last message only when loading
              />
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-page-bg">
            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
