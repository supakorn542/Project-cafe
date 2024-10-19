import { db } from "../firebase"; // ไฟล์ firebase สำหรับ config ของ Firestore
import { collection, addDoc } from "firebase/firestore"; 

export const addCoffeeOption = async (data: {
  product_id: string;
  intensity: string[];
  sweetness: string[];
}) => {
  try {
    const docRef = await addDoc(collection(db, "coffee_option"), {
      product_id: data.product_id,
      intensity: data.intensity,
      sweetness: data.sweetness,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
