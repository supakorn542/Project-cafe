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
            const idToken = await userCredential.user.getIdToken();
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
    <div className="flex flex-row justify-between min-h-screen bg-gray-100">
      <div className="hidden xs:block sm:w-2/3 flex flex-col justify-center items-center bg-gray-200">
        <h1 className="text-5xl font-bold">My APP</h1>
      </div>

      <div className="w-full sm:w-1/3 flex flex-col justify-center items-center p-8">
        <div className="w-3/4 p-4 space-y-4">
          <h4 className="text-2xl font-semibold">เข้าสู่ระบบสำเร็จ</h4>
          <h5 className="text-lg">
            ระบบกำลังนำท่านเข้าสู่ระบบ กรุณารอสักครู่....
          </h5>
        </div>
      </div>
    </div>
  );
};

export default LineCallback;
