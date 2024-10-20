import { doc, getDoc, updateDoc, setDoc, collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { CoffeeOption } from "../interfaces/coffeeOptionInterface";

export const getCoffeeOptionByProductId = async (productId: string) => {
     const productRef = doc(db, "products", productId);
    const coffeeOptionRef = collection(db, 'coffee_option');
    const q = query(coffeeOptionRef, where('product_id', '==', productRef));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.log('No matching documents found.'); // ตรวจสอบว่ามีเอกสารหรือไม่
      return null; // คืนค่า null ถ้าไม่มีเอกสาร
    }
  
    const coffeeOptions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CoffeeOption[];
    return coffeeOptions[0]; // คืนค่าเอกสารแรก
  };

  export const updateCoffeeOption = async (coffeeOptionId: string, coffeeOptionData: { intensity: string[], sweetness: string[] }) => {
    const coffeeOptionRef = doc(db, 'coffee_option', coffeeOptionId); // ใช้ coffeeOptionId ที่ตรงกับเอกสารที่คุณต้องการอัปเดต
    await updateDoc(coffeeOptionRef, {
        intensity: coffeeOptionData.intensity,
        sweetness: coffeeOptionData.sweetness,
    });
};
    