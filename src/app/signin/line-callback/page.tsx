"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import nookies from "nookies";

const LineCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      "firebaseToken"
    );
    if (token) {
      (async () => {
        try {
          const userCredential = await signInWithCustomToken(auth, token);
          if (userCredential.user) {
            let tokenResult = await userCredential.user.getIdTokenResult(true);
            let role = tokenResult.claims?.role;
            
            if (!role) {
              ;
              await fetch("/api/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: userCredential.user.uid, role: "user" }),
              });
        
              // รีเฟรช token หลังจากตั้งค่า role ใหม่
              tokenResult = await userCredential.user.getIdTokenResult(true);
              role = tokenResult.claims?.role;
            } else {
              ;
            }
        
            const token = tokenResult.token;


            nookies.set(null, "token", token, {
              maxAge: 60 * 60 * 24,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              httpOnly: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });

            router.push("/user/profile");
          } else {
            setError("No user returned after signing in.");
          }
        } catch (error: any) {
          ;
          setError("Error signing in with LINE: " + error.message);
        }
      })();
    }
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row justify-center min-h-screen bg-white p-4">
  
      <div className="w-full flex flex-col justify-center items-center p-8">
        <h4 className="text-xl sm:text-2xl md:text-3xl font-serif4 text-center">
          เข้าสู่ระบบสำเร็จ
        </h4>
        <h5 className="text-sm sm:text-lg md:text-xl font-serif4 text-center mt-2">
          ระบบกำลังนำท่านเข้าสู่ระบบ กรุณารอสักครู่....
        </h5>
      </div>
  
    </div>
  );
  
};

export default LineCallback;
