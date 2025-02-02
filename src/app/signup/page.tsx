"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import "react-datepicker/dist/react-datepicker.css";
const DatePicker = dynamic(() => import("react-datepicker") as unknown as Promise<{ default: React.ComponentType<any> }>, { ssr: false });

import signupImage from "../../../public/assets/signup-image.jpg"; 

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telNumber, setTelNumber] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDOB] = useState<Date | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const validateTelNumber = (tel: string) => {
    const phoneRegex = /^[0-9]{10}$/; 
    return phoneRegex.test(tel);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTelNumber(telNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const dobTimestamp = dob ? Timestamp.fromDate(dob) : null;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        telNumber,
        email,
        dob: dobTimestamp,
        username,
        createdAt: new Date(),
      });

      await fetch("/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, role: "user" }),
      });

      alert("User registered successfully");

      router.push("/signin");
    } catch (error) {
      
    if (error instanceof Error) {
      let errorMessage = "Error signing up. Please try again.";


      if (error.message.includes("auth/email-already-in-use")) {
        errorMessage = "The email address is already in use. Please use a different email.";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "The email address is not valid. Please check your email format.";
      } else if (error.message.includes("auth/weak-password")) {
        errorMessage = "The password is too weak. Please use at least 6 characters.";
      } else if (error.message.includes("auth/missing-email")) {
        errorMessage = "Email is required.";
      } else if (error.message.includes("auth/missing-password")) {
        errorMessage = "Password is required.";
      }

      alert(errorMessage);
      console.error("Error signing up:", error);
    }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-end bg-[#013927] overflow-auto">
      <div className="flex flex-col lg:flex-row w-full max-w-[1440px] h-auto lg:h-[768px]   ">
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center  ">
          <h2 className="text-4xl lg:text-6xl font-playfair font-bold mb-6 lg:mb-10 text-center text-white">
            Welcome To Forest Tales
          </h2>

          <form onSubmit={handleSignUp} className="mt-3 w-11/12 sm:w-5/6">
            <div className="relative ">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
                required
              />
              <label
                htmlFor="username"
                className="absolute font-serif4 font-bold text-lg lg:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Username
              </label>
            </div>

            <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
              <div className="relative mt-7">
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
                  required
                />
                <label
                  htmlFor="firstName"
                  className="absolute font-serif4 font-bold text-lg lg:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
                >
                  First name
                </label>
              </div>

              <div className="relative mt-7">
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white peer"
                  required
                />
                <label
                  htmlFor="lastName"
                  className="absolute font-serif4 font-bold text-lg lg:text-xl text-white duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
                >
                  Last name
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="relative mt-7 z-20">
                <DatePicker
                  id="dob"
                  selected={dob}
                
                  onChange={(dob :  Date | null) => setDOB(dob)}
                  onFocus={() => setIsFocused(true)} 
                  onBlur={() => setIsFocused(false)} 
                  dateFormat="yyyy/MM/dd"
                  placeholderText=" "
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  className="block w-full px-2.5 pb-2.5 pt-3 text-base lg:text-lg  text-white bg-transparent border-2 border-white rounded-3xl focus:outline-none "
                  calendarClassName="custom-datepicker "
                />
                <label
                  htmlFor="dob"
                  className={`absolute text-lg lg:text-xl font-serif4 font-bold text-white bg-[#013927] px-1 transition-all duration-200 
                            ${
                              dob || isFocused
                                ? "top-2 scale-75 -translate-y-5"
                                : "top-1/2 scale-100 -translate-y-1/2"
                            } 
                            left-2.5 transform`}
                >
                  Date of Birth
                </label>
              </div>
              <div className="relative mt-7">
                <input
                  type="text"
                  id="telNumber"
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                  placeholder=" "
                  className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
                  required
                />
                <label
                  htmlFor="telNumber"
                  className="absolute font-serif4 font-bold text-lg lg:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
                >
                  Tel.
                </label>
              </div>
            </div>

            <div className="relative mt-7">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
                required
              />
              <label
                htmlFor="email"
                className="absolute font-serif4 font-bold text-lg lg:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
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
                placeholder=" "
                className="block px-2.5 pb-2.5 pt-3 w-full text-base lg:text-lg text-white bg-transparent rounded-3xl border-2 border-white  peer"
                required
              />
              <label
                htmlFor="password"
                className="absolute font-serif4 font-bold text-lg lg:text-xl text-white  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#013927] px-2 peer-focus:px-2 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white font-serif4 text-xl lg:text-2xl font-bold text-[#013927] py-2 lg:py-3 rounded-full hover:bg-slate-200 transition duration-300 mt-7"
            >
              Sign up
            </button>
          </form>

          <p className="text-center font-serif4 text-lg text-white mt-3">
            Already have an account ?{" "}
            <a
              href="/signin"
              className="text-white font-serif4 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
        <div className="hidden md:flex flex-1 flex-col items-end">
          <div className="relative w-5/6 h-full ">
            <Image
              src={signupImage} 
              alt="Forest Tales Coffee"
              fill
              className="object-cover "


            />
          </div>
        </div>
      </div>
    </div>
  );
}
