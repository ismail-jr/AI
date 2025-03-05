"use client";
import { useAuth } from "../contexts/authcontext";
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
  timestamp?: number | Date;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  pastQueries: Message[];
  startNewChat: () => Promise<void>;
  deleteQuery: (id: string) => Promise<void>;
  loading: boolean;
  activeChat: string | null;
  setActiveChat: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pastQueries, setPastQueries] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setPastQueries([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setPastQueries(fetchedMessages.filter((msg) => msg.role === "user"));
      setMessages(fetchedMessages.reverse());
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (message: string) => {
    if (!user) return;

    setLoading(true); // ✅ Start Loading

    try {
      // ✅ Save User Message to Firestore (UI updates automatically via onSnapshot)
      await addDoc(collection(db, "users", user.uid, "messages"), {
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      // ✅ Get AI Response
      const response = await sendMessageToAI(message);

      // ✅ Save AI Response to Firestore (UI updates automatically via onSnapshot)
      await addDoc(collection(db, "users", user.uid, "messages"), {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // ✅ Stop Loading
    }
  };

  const startNewChat = async () => {
    if (!user) return;

    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "messages")
    );
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setMessages([]);
    setPastQueries([]);
    setActiveChat(null);
  };

  const deleteQuery = async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "messages", id));
      setPastQueries((prev) => prev.filter((query) => query.id !== id));
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
        activeChat,
        setActiveChat,
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
