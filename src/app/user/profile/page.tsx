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

  const convertTimestampToDate = (timestamp: any) => {
    const data = timestamp.toDate().toLocaleDateString("th-TH", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      
      
    });
    return data
  };

  

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

  useEffect(() => {
    if (userData) {
      console.log("Updated user data:", userData);
    }
  }, [userData]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#FBF6F0] p-4">
        <div className="bg-transparent rounded-xl border border-black shadow-md p-8 w-4/5">
          <div className="flex flex-col items-end">
            <button className="border border-black  text-xl rounded-full px-4 py-2 ">
              Order History
            </button>
          </div>
          <div className="flex mt-6 justify-around">
            <div className="">
              <span className="font-serif4 text-xl">First Name : </span>
              <span className="font-serif4 text-xl">
                {userData?.firstName || "N/A"}
              </span>
            </div>
            <div className="">
              <span className="font-serif4 text-xl">Last Name : </span>
              <span className="font-serif4 text-xl">
                {userData?.lastName || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex mt-6 justify-around">
            <div className="">
              <span className="font-serif4 text-xl">DOB: </span>
              <span className="font-serif4 text-xl">
                {userData?.dob ? convertTimestampToDate(userData.dob) : "N/A"}
              </span>

            </div>
            <div className="">
              <span className="font-serif4 text-xl">Tel. : </span>
              <span className="font-serif4 text-xl">
                {userData?.telNumber || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex mt-6 justify-around">
            <div className="">
              <span className="font-serif4 text-xl">Email: </span>
              <span className="font-serif4 text-xl">
              {userData?.email || "N/A"}
              </span>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
