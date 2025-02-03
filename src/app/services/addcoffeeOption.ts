import { db } from "../lib/firebase"; // ไฟล์ firebase สำหรับ config ของ Firestore
import { collection, addDoc, doc } from "firebase/firestore"; 

export const addCoffeeOption = async (data: {
  product_id: string; // ควรเป็น ID ของเอกสาร product ที่จะอ้างอิง
  intensity: string[];
  sweetness: string[];
}) => {
  try {
    // สร้าง reference ไปยังเอกสารของ product ที่ระบุใน product_id
    const productRef = doc(db, "products", data.product_id);

    const docRef = await addDoc(collection(db, "coffee_option"), {
      product_id: productRef, // บันทึกเป็น reference แทนที่จะเป็น string
      intensity: data.intensity,
      sweetness: data.sweetness,
    });
    ;
  } catch (e) {
    ;
  }
};
