"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/authContext";
import { User } from "../../interfaces/user";

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  console.log("user:", user);

  useEffect(() => {
    const getUserById = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.id));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          } else {
            console.warn("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    getUserById();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Profile
          </h1>
          <p className="text-lg mb-2">TEST EMULATOR!</p>
          {userData ? (
            <div>
              <p className="text-lg mb-2">Name: {userData.name}</p>
              <p className="text-lg">Email: {userData.email}</p>
            </div>
          ) : (
            <p className="text-lg text-center text-gray-600">
              Loading user data...
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
