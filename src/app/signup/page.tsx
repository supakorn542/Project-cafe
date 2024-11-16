// "use client";

// import { useState } from "react";
// import { auth, db } from "../lib/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc, Timestamp } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// // import Image from "next/image";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [telNumber, setTelNumber] = useState("");
//   const [dob, setDOB] = useState<Date | null>(null);

//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       const dobTimestamp = dob ? Timestamp.fromDate(dob) : null;

//       await setDoc(doc(db, "users", user.uid), {
//         firstName,
//         lastName,
//         telNumber,
//         email,
//         dob: dobTimestamp,
//         createdAt: new Date(),
//       });

//       alert("User registered successfully");

//       router.push("/signin");
//     } catch (error) {
//       console.error("Error signing up:", error);
//       alert("Error signing up");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-custom-gradient overflow-auto">
//       <div className="flex w-full max-w-[1440px] h-[670px]   ">
//         <div className="flex-1 p-8 flex flex-col items-center  ">
//           <h2 className="text-6xl font-playfair font-bold mb-10 text-center">
//             Welcome To Forest Tales
//           </h2>

//           <form onSubmit={handleSignUp} className="mt-3 w-5/6">
//             <div className="relative">
//               <input
//                 type="text"
//                 id="floating_outlined"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 placeholder=" "
//                 className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
//                 required
//               />
//               <label
//                 htmlFor="floating_outlined"
//                 className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f6dbb4] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
//               >
//                 First name
//               </label>
//             </div>

//             <div className="relative mt-7">
//               <input
//                 type="text"
//                 id="floating_outlined"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 placeholder=" "
//                 className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
//                 required
//               />
//               <label
//                 htmlFor="floating_outlined"
//                 className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f6dfbf] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
//               >
//                 Last name
//               </label>
//             </div>

//             <div className="flex justify-between">
//               <div className="relative mt-7 z-20">
//                 <DatePicker
//                   selected={dob}
//                   onChange={(dob) => setDOB(dob)}
//                   dateFormat="yyyy/MM/dd"
//                   placeholderText=" "
//                   showYearDropdown
//                   showMonthDropdown
//                   dropdownMode="select"
//                   maxDate={new Date()}
//                   className="block w-full px-2.5 pb-2.5 pt-3 text-xl text-black bg-transparent rounded-3xl border-2 border-black peer"
//                   calendarClassName="custom-datepicker"
//                 />
//                 <label className="absolute font-serif4 font-bold text-xl text-[black] duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f6dfbf] px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3">
//                   Date of Birth
//                 </label>
//               </div>

//               <div className="relative mt-7">
//                 <input
//                   type="text"
//                   id="floating_outlined"
//                   value={telNumber}
//                   onChange={(e) => setTelNumber(e.target.value)}
//                   placeholder=" "
//                   className="block px-2.5 pb-2.5 pt-3 w-full text-xl text-black bg-transparent rounded-3xl border-2 border-black  peer"
//                   required
//                 />
//                 <label
//                   htmlFor="floating_outlined"
//                   className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f9ebda] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
//                 >
//                   Tel.
//                 </label>
//               </div>
//             </div>

//             <div className="relative mt-7">
//               <input
//                 type="email"
//                 id="floating_outlined"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder=" "
//                 className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
//                 required
//               />
//               <label
//                 htmlFor="floating_outlined"
//                 className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f7e3c8] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
//               >
//                 Email
//               </label>
//             </div>

//             <div className="relative mt-7">
//               <input
//                 type="password"
//                 id="floating_outlined"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder=" "
//                 className="block px-2.5 pb-2.5 pt-3 w-full text-lg text-black bg-transparent rounded-3xl border-2 border-black  peer"
//                 required
//               />
//               <label
//                 htmlFor="floating_outlined"
//                 className="absolute font-serif4 font-bold text-xl text-[black]  duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#f7e3c8] px-2 peer-focus:px-2 peer-focus:text-black  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3"
//               >
//                 Password
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-black font-serif4 text-2xl font-bold text-white py-3 rounded-full hover:bg-gray-800 transition duration-300 mt-7"
//             >
//               Sign up
//             </button>
//           </form>

//           <p className="text-center font-serif4 text-lg text-black mt-3">
//             Already have an account ?{" "}
//             <a
//               href="/signin"
//               className="text-black font-serif4 font-semibold hover:underline"
//             >
//               Sign in
//             </a>
//           </p>
//         </div>
//         <div className="flex-1 p-2 flex flex-col items-end">
//           <div className="relative w-5/6 h-full ">
//             <Image
//               src="/assets/signup-image.jpg"
//               alt="Forest Tales Coffee"
//               fill
//               className="object-cover rounded-3xl"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
