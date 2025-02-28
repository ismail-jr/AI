"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { sendMessageToAI } from "@/lib/openai";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: any;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  pastQueries: Message[];
  startNewChat: () => Promise<void>;
  deleteQuery: (id: string) => Promise<void>; // ✅ Added delete function
  loading: boolean; // ✅ AI response loading state
  activeChat: string | null; // ✅ Define activeChat state
  setActiveChat: (id: string | null) => void; // ✅ Define setter function
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pastQueries, setPastQueries] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false); // ✅ Tracks if AI is thinking
  const [activeChat, setActiveChat] = useState<string | null>(null); // ✅ Track active chat

  useEffect(() => {
    // ✅ Fetch chat history from Firestore (sorted by timestamp)
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setPastQueries(fetchedMessages.filter((msg) => msg.role === "user"));
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true); // ✅ Start loading state

    await addDoc(collection(db, "messages"), {
      ...userMessage,
      timestamp: new Date(),
    });

    try {
      const response = await sendMessageToAI(message);
      const aiMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMessage]);

      await addDoc(collection(db, "messages"), {
        ...aiMessage,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // ✅ Stop loading state
    }
  };

  const startNewChat = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setMessages([]);
    setPastQueries([]);
  };

  const deleteQuery = async (id: string) => {
    try {
      await deleteDoc(doc(db, "messages", id)); // ✅ Delete from Firestore
      setPastQueries((prev) => prev.filter((query) => query.id !== id)); // ✅ Remove from UI
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        pastQueries,
        startNewChat,
        deleteQuery,
        loading,
        activeChat, // ✅ Provide activeChat state
        setActiveChat, // ✅ Provide function to update activeChat
      }}
    >
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
