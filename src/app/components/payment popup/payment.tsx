import React, { useState } from "react";
import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function Payment({ cartId, onClose }: { cartId: string; onClose: () => void }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

      if (response.data.url) {
        const uploadedImageUrl = response.data.url;

        // บันทึกข้อมูลการชำระเงิน
        const paymentData = {
          receipt: uploadedImageUrl, // URL ของรูปที่อัปโหลด
          pickuporderDate: new Date(),
          status: "Pending",
        };
        const docRef = await addDoc(collection(db, "payments"), paymentData);
        console.log("Payment saved with ID:", docRef.id);

        // บันทึกข้อมูลการสั่งซื้อ
        const paymentRef = doc(db, "payments", docRef.id);
        const cartRef = doc(db, "carts", cartId);
        const orderData = {
          orderDate: new Date(),
          cart_id: cartRef,
          total_price: 20,
          statusOrder: "Processing",
          payment_id: paymentRef,
        };
        const orderDocRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order saved with ID:", orderDocRef.id);

        // อัปเดตสถานะของ cart
        const cartDocRef = doc(db, "carts", cartId);
        await updateDoc(cartDocRef, { status: false });

        alert("การสั่งซื้อเสร็จสมบูรณ์!");
        onClose();
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("เกิดข้อผิดพลาดระหว่างการสั่งซื้อ");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-xl font-bold text-black">Payment</h2>
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
            onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
            disabled={isUploading}
          />
          <button
            type="submit"
            className="border rounded-lg bg-green-800 px-3 py-2"
            onClick={savePayment}
            disabled={isUploading}
          >
            {isUploading ? "กำลังอัปโหลด..." : "ยืนยันการสั่งซื้อ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
