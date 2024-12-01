"use client";

import { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A link to reset your password has been sent to your email.");
    } catch (err: any) {
      setError("An error occurred: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#013927]">
      <div className="flex w-[50%] max-w-[1440px] h-[670px]">

        <div className="flex-1 p-8 flex flex-col items-center">
          <h2 className="text-5xl font-playfair font-bold mb-10 text-center text-white">
            Forgot Password
          </h2>

          {message && <p className="text-white mb-4 text-lg">{message}</p>}
          {error && <p className="text-white-500 mb-4 text-lg">{error}</p>}

          <form onSubmit={handleResetPassword} className="mt-3 w-5/6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-white bg-transparent rounded-3xl border-2 border-white peer"
              />
              <label
                className="absolute font-serif font-bold text-xl text-white duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 start-3"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white font-serif text-2xl font-bold text-[#013927] py-3 rounded-full hover:bg-slate-200 transition duration-300 mt-7"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-base text-white font-serif text-center">
            <a className="text-white hover:underline" href="/signin">
              Back to Sign In page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
