"use client";

import { FormEvent, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
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
  const { signInWithGoogle } = useAuth();

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

        const tokenResult = await userCredential.user.getIdTokenResult();
        const token = tokenResult.token;
        const role = tokenResult.claims?.role;

        console.log("User role:", role);

        nookies.set(null, "token", token, {
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        console.log("Cookies set successfully");

        if (role === "admin") {
          router.push("/admin/products/menu"); // ถ้าเป็น admin ให้ไปหน้า admin
        } else {
          router.push("/user/profile"); // ถ้าไม่ใช่ admin ให้ไปหน้าโปรไฟล์
        }
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
    <div className="min-h-screen flex items-center  bg-[#013927]">
      <div className="flex w-full  max-w-[1440px] flex-col md:flex-row h-auto md:h-[695px]">
        <div className="flex-1  flex flex-col">
          <div className="relative w-full md:w-5/6 h-64 md:h-full ">
            <Image
              src="/assets/signin-image.jpg"
              alt="Forest Tales Coffee"
              fill
              className="object-cover "
            />
            <h2
              className="absolute md:hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-playfair font-bold text-center text-white  backdrop-blur-sm  rounded-xl  "   
            >
              Welcome To Forest Tales
            </h2>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center ">
          <h2 className="hidden md:block text-6xl font-playfair font-bold mb-10 text-center text-white">
            Welcome To Forest Tales
          </h2>

          {error && <p className="">{error}</p>}

          <form onSubmit={handleSignIn} className="mt-3 w-full md:w-5/6">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
                className="block px-2.5 pb-2 md:pb-2.5 pt-2.5 md:pt-3 w-full text-md md:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
              />
              <label
                htmlFor="email"
                className="absolute font-serif font-bold text-lg md:text-xl  text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Email
              </label>
            </div>

            <div className="relative mt-7">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="block px-2.5 pb-2 md:pb-2.5 pt-2.5 md:pt-3 w-full text-md md:text-lg text-white bg-transparent rounded-3xl border-2 border-white peer"
              />
              <label
                htmlFor="password"
                className="absolute font-serif4 font-bold text-lg md:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Password
              </label>
            </div>
            <div className="mt-2 text-right w-full">
              <a
                href="signin/forgot-password"
                className="text-base font-serif4 text-white hover:underline"
              >
                Forgot password ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-white font-serif4 text-xl md:text-2xl font-bold text-[#013927] py-2 md:py-3 rounded-full hover:bg-slate-200 transition duration-300 mt-7"
            >
              Log in
            </button>
          </form>
          <div className="flex items-center my-4 w-full">
            <div className="flex-grow h-0.5 bg-white"></div>
            <span className="px-4 text-md md:text-xl font-serif4 font-bold text-white">
              OR
            </span>
            <div className="flex-grow h-0.5 bg-white"></div>
          </div>

          <div className="mb-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full md:w-[80%] lg:w-[55%] border font-serif4 font-bold text-xl md:text-2xl border-white text-white py-2 md:py-3 rounded-full flex items-center justify-center hover:bg-[#174839] transition duration-300"
            >
              <svg
                className="w-6 h-7 mr-2 md:w-10 md:mr-5  lg:mr-5 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
          <div className="mb-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleLineSignIn}
              className="w-full  md:w-[80%] lg:w-[55%] border font-serif4 font-bold text-xl md:text-2xl border-white text-white py-2 md:py-3 rounded-full flex items-center justify-center hover:bg-[#174839] transition duration-300"
            >
              <svg
                className="h-8 w-7 mr-2 md:mr-5 "
                fill="#ffffff"
                viewBox="0 0 236.271 236.271"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M118.136,5.265C52.996,5.265,0,49.399,0,103.647c0,52.985,46.003,95.193,107.008,98.178 c4.137,0.189,7.655-2.987,7.858-7.124c0.202-4.137-2.987-7.655-7.125-7.858C54.87,184.256,15,148.49,15,103.647 c0-45.977,46.267-83.383,103.136-83.383s103.136,37.405,103.136,83.383c0,42.787-54.628,89.229-108.59,112.994 c-3.791,1.67-5.511,6.096-3.841,9.886c1.236,2.808,3.985,4.479,6.868,4.479c1.01,0,2.036-0.205,3.019-0.638 c28.936-12.743,57.466-31.556,78.277-51.616c25.689-24.764,39.268-50.734,39.268-75.105 C236.271,49.399,183.276,5.265,118.136,5.265z"></path>
                <path d="M60.082,79.668c-1.19-1.485-2.841-2.276-4.765-2.276c-1.923,0-3.564,0.806-4.747,2.331 c-1.084,1.409-1.609,3.338-1.609,5.902v39.135c0,2.742,0.563,4.741,1.723,6.111c1.232,1.457,3.14,2.196,5.67,2.196h21.267 c2.016,0,3.609-0.595,4.735-1.77c1.114-1.134,1.687-2.626,1.687-4.416c0-1.732-0.587-3.263-1.698-4.427 c-1.119-1.21-2.715-1.835-4.725-1.835H61.758V85.624C61.758,83.006,61.209,81.058,60.082,79.668z"></path>
                <path d="M93.756,77.392c-1.904,0-3.539,0.803-4.729,2.324c-1.083,1.386-1.633,3.374-1.633,5.909v40.041 c0,2.584,0.547,4.528,1.671,5.941c1.181,1.52,2.808,2.331,4.69,2.331c1.922,0,3.575-0.799,4.778-2.312 c1.114-1.413,1.677-3.417,1.677-5.961V85.624c0-2.561-0.567-4.563-1.685-5.951C97.314,78.179,95.666,77.392,93.756,77.392z"></path>
                <path d="M119.625,103.962l12.767,22.89c0.01,0.018,0.02,0.035,0.03,0.053c0.301,0.503,0.603,1.001,0.902,1.493l0.537,0.886 c0.602,0.973,1.195,1.749,1.824,2.392c0.744,0.768,1.535,1.327,2.411,1.704c0.934,0.381,1.881,0.559,2.93,0.559 c2.518,0,6.742-1.129,6.742-8.694v-39.96c0-2.431-0.483-4.268-1.479-5.615c-1.111-1.492-2.703-2.277-4.608-2.277 c-1.858,0-3.424,0.786-4.53,2.272c-0.997,1.375-1.475,3.207-1.475,5.621v22.619l-13.188-23.328l-0.678-1.245l-0.687-1.262 c-0.559-0.988-1.057-1.729-1.54-2.297c-0.574-0.703-1.27-1.275-2.069-1.7c-0.833-0.454-1.811-0.68-2.969-0.68 c-1.463,0-2.821,0.469-4.034,1.395c-1.171,0.875-2.03,2.038-2.539,3.444c-0.006,0.018-0.012,0.035-0.018,0.053 c-0.384,1.161-0.571,2.651-0.571,4.555v39.213c0,2.32,0.502,4.189,1.491,5.556c0.01,0.014,0.02,0.027,0.03,0.04 c1.144,1.499,2.733,2.29,4.597,2.29c1.835,0,3.409-0.783,4.551-2.265c1.044-1.361,1.572-3.251,1.572-5.622V103.962z"></path>
                <path d="M185.284,90.181c1.958,0,3.498-0.572,4.575-1.7c1.046-1.1,1.575-2.538,1.575-4.276c0-1.726-0.532-3.154-1.58-4.245 c-1.059-1.127-2.601-1.707-4.57-1.707h-23.262c-1.556,0-2.903,0.294-4.005,0.875c-1.221,0.659-2.117,1.686-2.68,3.061 c-0.478,1.162-0.71,2.595-0.71,4.378v38.193c0,2.745,0.57,4.746,1.743,6.118c1.215,1.448,3.121,2.189,5.653,2.189h23.941 c1.96,0,3.507-0.591,4.601-1.757c1.051-1.136,1.579-2.575,1.579-4.288c0-1.769-0.528-3.237-1.568-4.363 c-1.122-1.18-2.667-1.767-4.611-1.767h-18.524v-10.467h16.262c1.962,0,3.482-0.586,4.52-1.743c0.989-1.107,1.48-2.512,1.48-4.233 c0-1.708-0.532-3.136-1.58-4.225c-1.062-1.113-2.606-1.687-4.553-1.687h-16.627v-9.328H185.284z"></path>
              </svg>
              Sign in with LINE
            </button>
          </div>

          <p className="text-center font-serif4 text-sm md:text-lg text-white">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-white font-serif4 font-semibold hover:underline"
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
