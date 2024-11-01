"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import ProtectedRoute from "../utils/protectedRoute";
import { User } from "../interfaces/user";

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  console.log("user:", user);

  const getUserById = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as User);
      }
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Profile
          </h1>

          <p className="text-lg mb-2">TEST EMULATOR!</p>
          {!userData && (
            <div>
              <p className="text-lg mb-2">Name: {user?.displayName}</p>
              <p className="text-lg">Email: {user?.email}</p>
            </div>
          )}
          {userData && (
            <div>
              <p className="text-lg mb-2">Name: {userData.name}</p>
              <p className="text-lg">Email: {userData.email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProtectedRoute(Profile);
