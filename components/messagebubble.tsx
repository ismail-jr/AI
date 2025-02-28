"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, Check, Loader2 } from "lucide-react"; // 🌀 Loader Icon

// ✅ Message Type
interface Props {
  message: { role: "user" | "assistant"; content: string };
  isThinking?: boolean; // 🧠 Show loader when true
}

// ✅ Format Text for Markdown-like Styling
const formatText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold (**bold**)
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics (*italics*)
    .replace(/__(.*?)__/g, "<u>$1</u>") // Underline (__underline__)
    .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline code (`code`)
    .replace(/\n/g, "<br />") // Preserve line breaks
    .replace(/[-•*]\s+(.*?)(<br \/>|$)/g, "<strong>•</strong> $1<br />") // ✅ Make bullet points bold
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" class="text-blue-400">$1</a>'
    ); // Links [text](url)
};

const MessageBubble: React.FC<Props> = ({ message, isThinking }) => {
  const [copied, setCopied] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-scroll to Bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // ✅ Detect & Extract Code Blocks
  const isCode = message.content.includes("```");
  const textParts = message.content.split(/```([\s\S]*?)```/g);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
    >
      <div
        className={`chat-bubble p-3 leading-relaxed text-sm ${
          message.role === "user"
            ? "bg-blue-900 text-white"
            : "bg-gray-900 text-white"
        }`}
      >
        {/* 🔹 Render Text & Code Blocks */}
        {textParts.map((part, index) =>
          index % 2 === 0 ? (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: formatText(part) }}
            />
          ) : (
            <div key={index} className="relative my-2 rounded-md">
              <SyntaxHighlighter
                language="javascript"
                style={oneDark}
                customStyle={{
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "#1e1e1e",
                }}
              >
                {part.trim()}
              </SyntaxHighlighter>
              <button
                onClick={() => copyToClipboard(part.trim())}
                className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md transition"
              >
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
              </button>
            </div>
          )
        )}

        {/* 🌀 "Guido is thinking..." Loader */}
        {isThinking &&
          (console.log("Rendering spinner..."), // Debug log
          (
            <div className="flex items-center gap-2 mt-2 text-gray-100">
              <Loader2 className="animate-spin text-red-500" size={18} />{" "}
              {/* Debug style */}
              <span>Guido is thinking...</span>
            </div>
          ))}
      </div>

      {/* 📜 Auto-scroll target */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageBubble;
