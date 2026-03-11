"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/contexts/chatcontext";
import {
  ArrowUp,
  Sparkles,
  GraduationCap,
  Trophy,
  Heart,
  Lightbulb,
  Briefcase,
  Code2,
  Send,
  Mic,
  Paperclip,
  X,
  CornerDownLeft,
} from "lucide-react";

const suggestionCards = [
  {
    title: "Academic Support",
    description: "Study techniques & research guidance",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverColor: "group-hover:text-blue-500",
    hoverBg: "group-hover:bg-blue-500/5",
  },
  {
    title: "Scholarships",
    description: "Find opportunities & applications",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    hoverColor: "group-hover:text-yellow-500",
    hoverBg: "group-hover:bg-yellow-500/5",
  },
  {
    title: "Personal Growth",
    description: "Well-being & soft skills",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    hoverColor: "group-hover:text-rose-500",
    hoverBg: "group-hover:bg-rose-500/5",
  },
  {
    title: "Entrepreneurship",
    description: "Startup advice & business ideas",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    hoverColor: "group-hover:text-amber-500",
    hoverBg: "group-hover:bg-amber-500/5",
  },
  {
    title: "Career Guidance",
    description: "Resume & interview prep",
    icon: Briefcase,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    hoverColor: "group-hover:text-emerald-500",
    hoverBg: "group-hover:bg-emerald-500/5",
  },
  {
    title: "Coding Help",
    description: "Debug & optimize code",
    icon: Code2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    hoverColor: "group-hover:text-purple-500",
    hoverBg: "group-hover:bg-purple-500/5",
  },
];

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [showCards, setShowCards] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { sendMessage } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !attachedFile) return;

    let finalMessage = message;
    if (attachedFile) {
      finalMessage = `[Attached: ${attachedFile.name}]\n\n${message}`;
    }

    await sendMessage(finalMessage);
    setMessage("");
    setAttachedFile(null);
    setShowCards(false);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setShowCards(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    if (!isRecording) {
      // Start recording
    } else {
      // Stop recording and process
    }
  };

  const clearAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
      {/* Suggestion Cards */}
      {showCards && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent-soft)]">
              <Sparkles size={16} className="text-[var(--accent-primary)]" />
            </div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">
              Suggested topics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setMessage(`Tell me about ${card.title.toLowerCase()}`);
                    setShowCards(false);
                    textareaRef.current?.focus();
                  }}
                  className="group relative p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)] transition-all duration-200 text-left hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-lg ${card.bgColor} ${card.hoverColor} transition-colors`}
                    >
                      <Icon size={20} className={card.color} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5">
                        {card.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        {/* Attachment Preview */}
        {attachedFile && (
          <div className="mb-3 flex items-center gap-2 p-2 pr-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl w-fit max-w-full animate-in slide-in-from-bottom-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent-soft)]">
              <Paperclip size={14} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-sm text-[var(--text-primary)] truncate max-w-[200px]">
              {attachedFile.name}
            </span>
            <button
              type="button"
              onClick={clearAttachment}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            >
              <X size={14} className="text-[var(--text-tertiary)]" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div
          className={`relative rounded-2xl bg-[var(--bg-secondary)] border-2 transition-all duration-200 ${
            isFocused
              ? "border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/10"
              : "border-[var(--border-light)] hover:border-[var(--border-medium)]"
          }`}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowCards(false);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask Guido anything..."
            className="w-full max-h-52 min-h-[60px] p-4 pr-36 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none resize-none"
            rows={1}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* File Attachment */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                attachedFile
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Paperclip size={18} />
            </label>

            {/* Voice Input */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Mic size={18} />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() && !attachedFile}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                message.trim() || attachedFile
                  ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] hover:scale-105 shadow-md"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="absolute left-4 bottom-2 hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <CornerDownLeft size={14} />
            <span>to send</span>
          </div>
        </div>

        {/* Features Bar */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="text-xs text-[var(--text-tertiary)]">
                AI-powered
              </span>
            </div>
            <div className="w-px h-3 bg-[var(--border-light)]" />
            <span className="text-xs text-[var(--text-tertiary)]">
              Shift + Enter for new line
            </span>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[var(--text-tertiary)] text-right max-w-[300px] truncate">
            Guido may make mistakes. Verify important info.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
