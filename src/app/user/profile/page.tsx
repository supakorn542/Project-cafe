"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/authContext";
import { User } from "../../interfaces/user";
import { BiSolidEdit } from "react-icons/bi";
import Image from "next/image";

import axios from "axios";

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<User | null>(null);

  const convertTimestampToDate = (timestamp: any) => {
    return timestamp.toDate().toLocaleDateString("th-TH", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.id));
          if (userDoc.exists()) {
            const data = userDoc.data() as User;
            setUserData(data);
            setEditedData(data);
          } else {
            console.warn("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!userData || !editedData) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No authenticated user found");
      return;
    }

    try {
      if (editedData.email && userData.email !== editedData.email) {
        await updateEmail(currentUser, editedData.email);
      }

      const userRef = doc(db, "users", currentUser.uid);

      const updatedData: Partial<User> = { ...editedData };
      await updateDoc(userRef, updatedData);

      setUserData(editedData);
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary configuration is missing.');
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      console.log("Cloudinary Response:", response); // ตรวจสอบ response
      return response.data.secure_url; // URL ของรูปภาพที่อัปโหลด
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  return (
    <>
      <div
        className="bg-cover bg-center bg-no-repeat h-screen w-screen"
        style={{ backgroundImage: "url('/assets/profile-background.jpg')" }}
      >
        <Navbar textColor="text-white" />
        <div className="min-h-screen flex items-center justify-center  p-4">
          <div className="grid grid-cols-[3fr,6fr,1fr] grid-rows-[auto,auto,auto] gap-2 rounded-3xl  px-5 pb-10 pt-3 w-4/5 bg-white bg-opacity-20  backdrop-blur-xl">
            <div className="col-span-3 place-items-end">
              {!isEditing && (
                <BiSolidEdit
                  className="text-white cursor-pointer text-3xl"
                  onClick={handleEditClick}
                />
              )}
            </div>
            <div className="grid place-content-center">
              <Image
                src={userData?.profileImage || "/assets/signin-image.jpg"}
                alt="Profile"
                width={250}
                height={250}
                className="rounded-full border-2 border-white"
              />
            </div>

            <div className="row-span-2 ">
              <div className="flex flex-col gap-y-2">
                <div>
                  <div className="font-serif4 text-xl text-white py-2">
                    Username:{" "}
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.username || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData!,
                          username: e.target.value,
                        })
                      }
                      className="border border-white rounded-xl p-2   w-full"
                    />
                  ) : (
                    <input
                      className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                      disabled
                      value={userData?.username || "N/A"}
                    />
                  )}
                </div>
                <div className="flex justify-between gap-x-10">
                  <div className="w-full">
                    <div className="font-serif4 text-xl text-white py-2">
                      First Name:{" "}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.firstName || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            firstName: e.target.value,
                          })
                        }
                        className="border border-white rounded-xl p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.firstName || "N/A"}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="font-serif4 text-xl text-white py-2">
                      Last Name:{" "}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.lastName || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            lastName: e.target.value,
                          })
                        }
                        className="border border-white rounded-xl p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.lastName || "N/A"}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-x-10">
                  <div className="w-full">
                    <div className="font-serif4 text-xl text-white py-2">
                      DOB:{" "}
                    </div>
                    {isEditing ? (
                      <input
                        className="border border-white rounded-xl bg-white p-2 w-full"
                        disabled
                        value={
                          userData?.dob
                            ? convertTimestampToDate(userData.dob)
                            : "N/A"
                        }
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                        disabled
                        value={
                          userData?.dob
                            ? convertTimestampToDate(userData.dob)
                            : "N/A"
                        }
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="font-serif4 text-xl text-white py-2">
                      Tel:{" "}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.telNumber || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            telNumber: e.target.value,
                          })
                        }
                        className="border border-white rounded-xl p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.telNumber || "N/A"}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-serif4 text-xl text-white py-2">
                    Email:{" "}
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData?.email || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData!, email: e.target.value })
                      }
                      className="border border-white rounded-xl p-2  w-full "
                    />
                  ) : (
                    <input
                      className="border border-white rounded-xl p-2 bg-transparent text-white w-full"
                      disabled
                      value={userData?.email || "N/A"}
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="mt-4 flex space-x-4 justify-end">
                    <button
                      className="border border-white px-6  rounded-lg text-white text-xl font-bold"
                      onClick={handleCancelClick}
                    >
                      Back
                    </button>
                    <button
                      className="bg-white text-black px-6  rounded-lg text-xl font-bold"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="col-start-1 place-self-center ">
              

                <label className="  cursor-pointer bg-white text-black rounded-3xl px-4 py-1 text-xl hover:bg-[#c7c4c4] transition duration-300 font-serif4">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        console.log(e.target.files[0]); // ตรวจสอบไฟล์
                        const imageUrl = await uploadToCloudinary(
                          e.target.files[0]
                        );
                        if (imageUrl) {
                          setEditedData({
                            ...editedData!,
                            profileImage: imageUrl,
                          });
                        }
                      }
                    }}
                    className="hidden" // ซ่อน input
                  />
                </label>
              </div>
            ) : (
              <div className="col-start-1 place-self-center py-1 px-4   rounded-3xl bg-white text-black font-serif4 text-xl">
                <button>Order History</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
