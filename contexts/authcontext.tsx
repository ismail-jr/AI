"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, db } from "@/lib/firebase"; // Firebase Auth & Firestore
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile, // ✅ Import updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

// ✅ Define AuthContext Interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Sign Up with Email, Name, and Password
  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Update Firebase User Profile
      await updateProfile(user, { displayName: name });

      // ✅ Save user data (including name) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        createdAt: new Date().toISOString(),
        uid: user.uid,
      });

      setUser(auth.currentUser); // ✅ Ensure UI updates with new profile info
    } catch (error) {
      console.error("Sign-Up Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign In with Email and Password
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign-In Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUpWithEmail, signInWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
