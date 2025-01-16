import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function Payment({ cartId, onClose }: { cartId: string; onClose: () => void }) {
  // const [cartData, setCartData] = useState<CartData | null>(null);

  const [selectedImage, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
  
        try {
          const response = await axios.post("/api/uploads", {
            image: base64Image,
            publicId: `QRcode_pics/${cartId}`,
            folder: "QRcode_pics",
          });
  
          if (response.data.url) {
            setUploadedImageUrl(response.data.url); // เก็บ URL ใน State
            console.log("Image uploaded successfully:", response.data.url);
          } else {
            console.error("Failed to upload image");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };
  
      reader.readAsDataURL(file);
    }
  };

  const savePayment = async () => {
    const paymentData = {
      receipt: selectedImage, // ตัวอย่างค่า receipt
      pickuporderDate: new Date(), // วันที่และเวลา
      status: "Pending", // ตัวอย่างสถานะ
    };
  
    try {
      const docRef = await addDoc(collection(db, "payments"), paymentData);
      console.log("Document written with ID: ", docRef.id);

      const paymentRef = doc(db,"payments",docRef.id)
      const cartRef = doc(db,"carts",cartId)
       // ข้อมูล order พร้อม payment_id
    const orderData = {
      
      orderDate: new Date(), // วันที่และเวลา
      cart_id: cartRef, // ตัวอย่างค่า cart_id
      total_price: 20, // ราคาทั้งหมด
      statusOrder: "Processing", // สถานะการสั่งซื้อ
      payment_id: paymentRef, // ใช้ payment_id ที่เพิ่งบันทึก
    };

    // บันทึกข้อมูลลง orders
    const orderDocRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Order saved with ID:", orderDocRef.id);

      // อัปเดตสถานะของ cart
      const cartDocRef = doc(db, "carts", cartId);
      await updateDoc(cartDocRef, {
        status: false, 
      });
  
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-xl font-bold text-black">Payment</h2>
            <div>
              {/* <Image
                src={
                  
                }
                alt="QRcode"
                width={200}
                height={200}
              /> */}
            </div>
          </div>

          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleFileChange}
          />
        <button
          type="submit"
          className="border rounded-lg bg-green-800 px-3 py-2"
          onClick={savePayment}
        >

          ยืนยันการสั่งซื้อ
        </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
