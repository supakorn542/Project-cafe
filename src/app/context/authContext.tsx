"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { User } from "../interfaces/user";
import { doc, setDoc } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const newUser: User = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName || "Unknown",
          lastName: "",
          telNumber: "",
          dob: null,
          username: "",
          email: firebaseUser.email || "No Email",
          profileImage: "", 
          createdAt: new Date(),
        };
        setUser(newUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const newUser: User = {
        id: result.user.uid,
        firstName: "",
        lastName: "",
        telNumber: "",
        dob: null,
        email: result.user.email || "No Email",
        profileImage: result.user.photoURL || "", 
        username: result.user.displayName || "Unknown",
        createdAt: new Date(),
      };
      const tokenResult = await result.user.getIdTokenResult();
      const token = tokenResult.token;
      const role = tokenResult.claims?.role;

      nookies.set(null, "token", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      await saveUserData(newUser);
      setUser(newUser);
      router.push("/user/profile");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async (user: User) => {
    const userRef = doc(db, "users", user.id);
    await setDoc(
      userRef,
      {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      { merge: true }
    );
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      console.log("Signing out...");
      await signOut(auth);
      console.log("Firebase sign out successful.");

      nookies.destroy(null, "token", { path: "/" });

      console.log("Token cookie destroyed.");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
