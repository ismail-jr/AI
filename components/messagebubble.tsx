"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, Check, LoaderPinwheel } from "lucide-react";

interface Props {
  message: { role: "user" | "assistant"; content: string };
  isThinking?: boolean;
}

// Format Text for Markdown-like Styling
const formatText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(
      /`([^`]+)`/g,
      "<code class='bg-[var(--bg-tertiary)] px-1 py-0.5 rounded text-[var(--accent-primary)]'>$1</code>",
    )
    .replace(/\n/g, "<br />")
    .replace(
      /[-•*]\s+(.*?)(<br \/>|$)/g,
      "<span class='flex items-start gap-2'><span class='text-[var(--accent-primary)] font-bold'>•</span> <span>$1</span></span><br />",
    )
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" class="text-[var(--accent-primary)] hover:underline transition-colors">$1</a>',
    );
};

const MessageBubble: React.FC<Props> = ({ message, isThinking }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const textParts = message.content.split(/```([\s\S]*?)```/g);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={`chat ${message.role === "user" ? "chat-end" : "chat-start"} mb-4`}
    >
      {/* Avatar for Assistant */}
      {message.role === "assistant" && (
        <div className="chat-image avatar">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
            <span className="text-[var(--accent-primary)] text-sm font-bold">
              AI
            </span>
          </div>
        </div>
      )}

      {/* Avatar for User */}
      {message.role === "user" && (
        <div className="chat-image avatar">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <span className="text-[var(--text-secondary)] text-sm font-bold">
              U
            </span>
          </div>
        </div>
      )}

      <div
        className={`chat-bubble p-4 leading-relaxed text-sm ${
          message.role === "user"
            ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)]"
            : "bg-[var(--chat-assistant-bg)] text-[var(--chat-assistant-text)] border border-[var(--border-light)]"
        }`}
      >
        {/* Render Text & Code Blocks */}
        {textParts.map((part, index) =>
          index % 2 === 0 ? (
            <div
              key={index}
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatText(part) }}
            />
          ) : (
            <div
              key={index}
              className="relative my-3 rounded-lg overflow-hidden"
            >
              <div className="bg-[var(--bg-tertiary)] px-4 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                Code snippet
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={oneDark}
                customStyle={{
                  padding: "16px",
                  fontSize: "14px",
                  background: "var(--bg-tertiary)",
                  margin: 0,
                }}
              >
                {part.trim()}
              </SyntaxHighlighter>
              <button
                onClick={() => copyToClipboard(part.trim(), index)}
                className="absolute top-12 right-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] p-2 rounded-lg transition-all duration-200 border border-[var(--border-light)] shadow-md hover:scale-105"
                aria-label="Copy code"
              >
                {copiedIndex === index ? (
                  <Check size={16} className="text-[var(--accent-primary)]" />
                ) : (
                  <Clipboard size={16} />
                )}
              </button>
            </div>
          ),
        )}

        {/* "Guido is thinking..." Loader */}
        {isThinking && message.content.trim() !== "" && (
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              Guido is thinking...
            </span>
          </div>
        )}
      </div>

      {/* Auto-scroll target */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageBubble;
