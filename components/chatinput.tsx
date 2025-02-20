"use client";

import { useState } from "react";
import { useChat } from "@/contexts/chatcontext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex items-center bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about careers..."
        className="flex-1 border p-2 rounded-md"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
