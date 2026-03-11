"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, db, googleProvider, githubProvider } from "@/lib/firebase";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Save or Update User in Firestore
  const saveUserToFirestore = async (firebaseUser: User, name?: string) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
      name: name || firebaseUser.displayName || "User",
      email: firebaseUser.email,
      uid: firebaseUser.uid,
      photoURL: firebaseUser.photoURL,
      lastLogin: new Date().toISOString(),
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
      });
    } else {
      await setDoc(userRef, { lastLogin: userData.lastLogin }, { merge: true });
    }
  };

  // 2. Handle Redirect Results & Auth State
  useEffect(() => {
    // Check if we just returned from a redirect login (e.g. mobile)
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await saveUserToFirestore(result.user);
          router.push("/chat");
        }
      } catch (error) {
        console.error("Redirect Error:", error);
      }
    };

    handleRedirect();

    // Listen for Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // 3. Auth Actions
  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(newUser, { displayName: name });
      await saveUserToFirestore(newUser, name);
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: existingUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await saveUserToFirestore(existingUser);
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(result.user);
      router.push("/chat");
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await saveUserToFirestore(result.user);
      router.push("/chat");
    } catch (error: any) {
      console.error("GitHub Auth Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push("/homepage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
