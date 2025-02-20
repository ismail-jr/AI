"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { sendMessageToAI } from "@/lib/openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    const response = await sendMessageToAI(message);
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
