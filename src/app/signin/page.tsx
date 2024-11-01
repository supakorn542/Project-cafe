"use client";

import { FormEvent, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("firebaseToken");
    if (token) {
      (async () => {
        try {
          const userCredential = await signInWithCustomToken(auth, token);
          if (userCredential.user) {
            setUser(userCredential.user);
            router.push("/user");
          } else {
            setError("No user returned after signing in.");
          }
        } catch (error: any) {
          console.error("Error signing in with LINE:", error);
          setError("Error signing in with LINE: " + error.message);
        }
      })();
    }
  }, [router, setUser]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        console.log("User signed in:", userCredential.user);
        setUser(userCredential.user);
        router.push("/user");
      } else {
        throw new Error("No user returned");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error?.message || "An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User signed in with Google:", user);
      setUser(user);
      router.push("/user");
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setError(error?.message || "An unexpected error occurred.");
    }
  };

  const handleLineSignIn = () => {
    const redirectUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINE_CALLBACK_URL}&state=random_state_string&scope=profile`;
    console.log('Redirect URL:', redirectUrl); // เพิ่ม log เพื่อตรวจสอบค่า
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Sign in with Google
          </button>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleLineSignIn}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Sign in with LINE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
