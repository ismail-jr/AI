"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/contexts/chatcontext";
import { ArrowUp } from "lucide-react";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(true); // ✅ Controls visibility of system role cards
  const { sendMessage } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
    setShowCards(false); // ✅ Hide cards after sending a message
  };

  // ✅ Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height
    }
  }, [message]);

  return (
    <div className="relative w-full p-4">
      {/* 🔹 System Role Cards (Visible before clicking input) */}
      {showCards && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h3 className="font-semibold">🎯 Career Guidance</h3>
            <p className="text-sm text-gray-300">
              Get personalized career advice based on your interests.
            </p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h3 className="font-semibold">📊 Job Market Insights</h3>
            <p className="text-sm text-gray-300">
              Discover industry trends and top-demand careers.
            </p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h3 className="font-semibold">📚 Training & Courses</h3>
            <p className="text-sm text-gray-300">
              Find the best courses to upskill in your chosen field.
            </p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h3 className="font-semibold">📝 Resume & Interviews</h3>
            <p className="text-sm text-gray-300">
              Get tips on resume building and interview preparation.
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Chat Input Field */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setShowCards(false)} // ✅ Hide cards when input is clicked
          placeholder="Ask Guido..."
          className="w-full max-h-52 min-h-[4rem] p-4 pr-12 bg-gray-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition resize-none"
        />
        {/* 🔹 Arrow Icon (Send Button) */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`absolute right-4 bottom-4 p-2 rounded-full text-white transition ${
            message.trim()
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          <ArrowUp size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
