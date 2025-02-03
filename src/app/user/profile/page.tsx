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
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<User | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(false);

  const convertTimestampToDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString("th-TH", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    } else if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    } else {
      return "N/A";
    }
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

          }
        } catch (error) {
          ;
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
      ;
      return;
    }

    try {
      // อัปเดตอีเมลถ้ามีการเปลี่ยนแปลง
      if (editedData.email && userData.email !== editedData.email) {
        await updateEmail(currentUser, editedData.email);
      }

      const userRef = doc(db, "users", currentUser.uid);

      // เตรียมข้อมูลที่จะอัปเดต
      const updatedData: Partial<User> = { ...editedData };

      // อัปเดตรูปภาพถ้ามีการเปลี่ยนแปลง
      if (uploadedImageUrl && uploadedImageUrl !== userData.profileImage) {
        updatedData.profileImage = uploadedImageUrl;
      }

      // สมมติว่า editedData.dob เป็น Date หรือ null
      if (editedData.dob && editedData.dob instanceof Date) {
        updatedData.dob = Timestamp.fromDate(editedData.dob); // แปลงเป็น Timestamp
      } else if (!editedData.dob) {
        // ถ้าไม่มีการเปลี่ยนแปลง, ไม่ต้องอัปเดตค่า dob
        updatedData.dob = userData.dob;
      }
  
      // อัปเดตใน Firestore
      await updateDoc(userRef, updatedData);

      // อัปเดต State
      setUserData({ ...userData, ...updatedData });
      setUploadedImageUrl(undefined); // เคลียร์ค่า URL รูปภาพ
      setIsEditing(false);
      ;
    } catch (error) {
      ;
    }
  };

  const handleCancelClick = () => {
    setEditedData(userData);
    setUploadedImageUrl(undefined);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          const response = await axios.post("/api/uploads", {
            image: base64Image,
            publicId: `${user?.id}`,
            folder: "profile_pics",
          });

          if (response.data.url) {
            setUploadedImageUrl(response.data.url);
            ;
          } else {
            ;
          }
        } catch (error) {
          ;
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  
  return (
    <>
      <div
        className="bg-cover bg-center bg-no-repeat min-h-screen w-screen"
        style={{ backgroundImage: "url('/assets/profile-background.jpg')" }}
      >
        <Navbar textColor="text-white" />
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg text-xl font-bold text-black">
              Uploading...
            </div>
          </div>
        )}
        <div className="min-h-screen flex items-center justify-center  p-4 ">
          <div className="grid grid-cols-1 md:grid-cols-[3fr,6fr,1fr] grid-rows-[auto,auto,auto] gap-3 md:gap-2  rounded-3xl  mt-10 lg:mt-1 px-5 pb-3 md:pb-10 pt-3 w-4/5 bg-white bg-opacity-20  backdrop-blur-xl">
            <div className="hidden md:grid md:col-span-3 place-items-end">
              {!isEditing && (
                <BiSolidEdit
                  className="text-white cursor-pointer text-3xl"
                  onClick={handleEditClick}
                />
              )}
            </div>

            <div className="grid place-content-center">
              <Image
                src={uploadedImageUrl || userData?.profileImage || "/assets/default-user.jpg" }
                alt="Profile"
                width={250}
                height={250}
                style={{ aspectRatio: "1 / 1" }}
                priority={true}
                className="rounded-full border-2 border-white w-32 sm:w-40 md:w-48 lg:w-64 h-auto"
              />
            </div>
            {isEditing ? (
              <div className=" md:hidden col-start-1 place-self-center ">
                <label className="  cursor-pointer bg-white text-black rounded-3xl px-4 py-1 text-lg hover:bg-[#c7c4c4] transition duration-300 font-serif4">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className=" md:hidden text-center text-white text-lg font-bold">
                <h2>{userData?.username}</h2>
              </div>
            )}

            <div className="row-span-2 ">
              <div className="flex flex-col md:gap-y-2">
                <div>
                  <div
                    className={`${
                      isEditing ? "block" : "hidden lg:block"
                    } font-serif4 text-lg md:text-xl text-white py-2`}
                  >
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
                      className="border border-white rounded-xl p-1.5 md:p-2   w-full"
                    />
                  ) : (
                    <input
                      className="hidden md:block border border-white rounded-xl p-2 bg-transparent text-white w-full"
                      disabled
                      value={userData?.username || "N/A"}
                    />
                  )}
                </div>
                <div className="md:flex md:justify-between gap-x-10">
                  <div className="w-full">
                    <div className="font-serif4 text-lg md:text-xl text-white py-2">
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
                        className="border border-white rounded-xl p-1.5 md:p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border  border-white rounded-xl p-1.5 md:p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.firstName || "N/A"}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <div className="font-serif4 text-lg md:text-xl text-white py-2">
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
                        className="border border-white rounded-xl p-1.5 md:p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-1.5 md:p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.lastName || "N/A"}
                      />
                    )}
                  </div>
                </div>
                <div className="md:flex md:justify-between gap-x-10">
                  <div className="w-full">
                    <div className="font-serif4 text-lg md:text-xl text-white py-2">
                      DOB:{" "}
                    </div>
                    {isEditing ? (
                      <input
                        className="border border-white rounded-xl bg-white p-1.5 md:p-2 w-full"
                        type="date"
                        value={
                          editedData?.dob
                            ? convertTimestampToDate(editedData.dob)
                            : "N/A"
                        }
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            dob: new Date(e.target.value),
                          })
                        }
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-1.5 md:p-2 bg-transparent text-white w-full"
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
                    <div className="font-serif4 text-lg md:text-xl text-white py-2">
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
                        className="border border-white rounded-xl p-1.5 md:p-2  w-full "
                      />
                    ) : (
                      <input
                        className="border border-white rounded-xl p-1.5 md:p-2 bg-transparent text-white w-full"
                        disabled
                        value={userData?.telNumber || "N/A"}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-serif4 text-lg md:text-xl text-white py-2">
                    Email:{" "}
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData?.email || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData!, email: e.target.value })
                      }
                      className="border border-white rounded-xl p-1.5 md:p-2  w-full "
                    />
                  ) : (
                    <input
                      className="border border-white rounded-xl p-1.5 md:p-2 bg-transparent text-white w-full"
                      disabled
                      value={userData?.email || "N/A"}
                    />
                  )}
                </div>

                {isEditing && (
                  <div className="mt-4 flex space-x-4 md:justify-end justify-between">
                    <button
                      className="border border-white px-5 md:px-6  rounded-lg text-white text-lg md:text-xl font-bold"
                      onClick={handleCancelClick}
                    >
                      Back
                    </button>
                    <button
                      className="bg-white text-black px-5 md:px-6  rounded-lg text-lg md:text-xl font-bold"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="hidden md:grid col-start-1 place-self-center ">
                <label className="  cursor-pointer bg-white text-black rounded-3xl px-4 py-1 text-xl hover:bg-[#c7c4c4] transition duration-300 font-serif4">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="col-start-1 md:place-self-center text-center md:py-1 px-4   rounded-3xl bg-white text-black font-serif4 text-lg md:text-xl">
                <Link href={"orderhistory"}>
                  <button>Order History</button>
                </Link>
              </div>
            )}
            <div
              className={`${
                isEditing ? "hidden" : "grid md:hidden"
              }  place-items-end`}
            >
              <BiSolidEdit
                className="text-white cursor-pointer text-3xl"
                onClick={handleEditClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
