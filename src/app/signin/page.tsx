"use client";

import { FormEvent, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import nookies from "nookies";
import Image from "next/image";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {}, []);

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

        const token = await userCredential.user.getIdToken();
        console.log("Token Client:", token);

        nookies.set(null, "token", token, {
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        router.push("/user/profile");
      } else {
        throw new Error("No user returned");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error?.message || "An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setError(error?.message || "An unexpected error occurred.");
    }
  };

  const handleLineSignIn = () => {
    const redirectUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINE_CALLBACK_URL}&state=random_state_string&scope=profile%20openid%20email`;
    console.log("Redirect URL:", redirectUrl);
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gradient">
      <div className="flex w-full max-w-[1440px] h-[670px]  overflow-hidden">
        <div className="flex-1 p-2 flex flex-col  ">
          <div className="relative w-5/6 h-full ">
            <Image
              src="/assets/signin-image.jpg"
              alt="Forest Tales Coffee"
              fill
              className="object-cover rounded-3xl"
            />
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center ">
          <h2 className="text-6xl font-playfair font-bold mb-10 text-center">
            Welcome To Forest Tales
          </h2>

          {error && <p className="">{error}</p>}

          <form onSubmit={handleSignIn} className="mt-3 w-5/6">
            <div className="relative">
              <input
                type="email"
                id="floating_outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
              />
              <label
                htmlFor="floating_outlined"
                className="absolute font-serif font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f8eee1] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Email
              </label>
            </div>

            <div className="relative mt-7">
              <input
                type="password"
                id="floating_outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
              />
              <label
                htmlFor="floating_outlined"
                className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f8eee1] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Password
              </label>
            </div>
            <div className="mt-2 text-right w-full">
              <a
                href=""
                className="text-base font-serif4 text-black hover:underline"
              >
                Forgot password ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black font-serif4 text-2xl font-bold text-white py-3 rounded-full hover:bg-gray-800 transition duration-300 mt-7"
            >
              Log in
            </button>
          </form>
          <div className="flex items-center my-4 w-full">
            <div className="flex-grow h-0.5 bg-black"></div>
            <span className="px-4 text-xl font-serif4 font-bold text-black">OR</span>
            <div className="flex-grow h-0.5 bg-black"></div>
          </div>

          <div className="mb-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-1/2 border font-serif4 font-bold text-2xl border-black text-black py-3 rounded-full  hover:bg-[#f7dab1] transition duration-300"
            >
              Sign in with Google
            </button>
          </div>
          <div className="mb-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleLineSignIn}
              className="w-1/2 border font-serif4 font-bold text-2xl border-black text-black py-3 rounded-full  hover:bg-[#f7dab1] transition duration-300"
            >
              Sign in with LINE
            </button>
          </div>

          <p className="text-center font-serif4 text-lg text-black mt-2">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-black font-serif4 font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
