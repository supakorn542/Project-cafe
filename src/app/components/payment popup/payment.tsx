"use client"; // ถ้าใช้ App Router ใน Next.js 13+

import React, { useState, useEffect } from "react";
import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ใช้ `useRouter` จาก next/navigation

function Payment({
  cartId,
  onClose,
  totalPrice,
}: {
  cartId: string;
  onClose: () => void;
  totalPrice: number;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date>(new Date()); // ตั้งค่าเริ่มต้น
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(URL.createObjectURL(selectedImage));
      }
    };
  }, [selectedImage]);

  const handlePreOrderClick = () => setShowDateTimePicker(true);

  const handleOrderNowClick = () => {
    setPickupDate(new Date());
    setShowDateTimePicker(false);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const savePayment = async () => {
    if (!selectedImage) {
      alert("กรุณาอัปโหลดไฟล์ก่อนยืนยันการสั่งซื้อ");
      return;
    }

    setIsUploading(true);

    try {
      // อัปโหลดรูปภาพไปยัง Cloudinary
      const base64Image = await toBase64(selectedImage);
      const response = await axios.post("/api/uploads", {
        image: base64Image,
        publicId: `QRcode_pics/${cartId}`,
        folder: "QRcode_pics",
      });

      if (!response.data.url) throw new Error("Image upload failed");

      const uploadedImageUrl = response.data.url;

      // บันทึกข้อมูลการชำระเงิน
      const paymentData = {
        receipt: uploadedImageUrl,
        pickuporderDate: new Date(),
        status: "Pending",
      };
      const paymentRef = await addDoc(collection(db, "payments"), paymentData);

      // อัปเดตข้อมูลการสั่งซื้อ
      const cartRef = doc(db, "carts", cartId);
      const orderData = {
        orderDate: new Date(),
        cart_id: cartRef,
        pickuporderDate: pickupDate,
        total_price: totalPrice,
        statusOrder: "Pending",
        payment_id: paymentRef,
      };
      await addDoc(collection(db, "orders"), orderData);

      // อัปเดตสถานะของ cart
      await updateDoc(cartRef, { status: false });

      alert("การสั่งซื้อเสร็จสมบูรณ์!");
      router.push("/user/orderhistory");
      onClose();
    } catch (error) {
      ;
      alert("เกิดข้อผิดพลาดระหว่างการสั่งซื้อ");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between items-center relative max-h-full md:max-h-min overflow-auto">
        <button onClick={onClose} className="absolute top-6 right-6">
          X
        </button>

        <div className="flex-none md:flex md:gap-3">
          <Image
            src="/assets/Payment.png"
            alt="payment"
            width={300}
            height={300}
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              อัปโหลดสลิปเงิน
            </label>

            <div className="flex items-center justify-center w-full">
              {selectedImage ? (
                <div className="w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Uploaded Image"
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setSelectedImage(file);
                    }}
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col my-2 gap-2 w-full">
              <label className="text-lg font-semibold">
                ต้องการรับเลยมั้ย?
              </label>
              <div className="flex space-x-3 justify-evenly">
                <button
                  onClick={handleOrderNowClick}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  รับเดี๋ยวนี้
                </button>
                <button
                  onClick={handlePreOrderClick}
                  className="border border-green-600 text-green-600 font-semibold py-2 px-4 rounded w-full"
                >
                  สั่งล่วงหน้า
                </button>
              </div>

              {showDateTimePicker && (
                <div className="mt-4">
                  <label htmlFor="datetime-local" className="block mb-2">
                    ต้องการรับออเดอร์ช่วงเวลาไหน
                  </label>
                  <input
                    type="datetime-local"
                    id="datetime-local"
                    className="border border-gray-400 rounded"
                    onChange={(e) => setPickupDate(new Date(e.target.value))}
                  />
                </div>
              )}

              <button
                className="bg-green-800 text-white rounded-lg px-3 py-2 mt-4 w-full"
                onClick={savePayment}
                disabled={isUploading}
              >
                {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการสั่งซื้อ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
