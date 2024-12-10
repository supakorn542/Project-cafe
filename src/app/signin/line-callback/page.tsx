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
            const idToken = await userCredential.user.getIdToken(true);
            nookies.set(null, "token", idToken, {
              maxAge: 60 * 60 * 24, 
              path: "/",
            });

            router.push("/user/profile");
          } else {
            setError("No user returned after signing in.");
          }
        } catch (error: any) {
          console.error("Error signing in with LINE:", error);
          setError("Error signing in with LINE: " + error.message);
        }
      })();
    }
  }, []);

  return (
    <div className="flex flex-row justify-center min-h-screen bg-white">

      <div className="w-full flex flex-col justify-center items-center p-8">
       
          <h4 className="text-2xl font-serif4">เข้าสู่ระบบสำเร็จ</h4>
          <h5 className="text-lg font-serif4">
            ระบบกำลังนำท่านเข้าสู่ระบบ กรุณารอสักครู่....
          </h5>
        
      </div>
    </div>
  );
};

export default LineCallback;
