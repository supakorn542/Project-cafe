import { db } from "../lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export const deleteOptionWithReferences = async (optionId: string) => {
  try {
    const optionRef = doc(db, "options", optionId); // 🔹 สร้าง Document Reference

    // 1️⃣ ลบเอกสารจาก optionItems ที่อ้างอิง optionId
    const optionItemsRef = collection(db, "optionItems");
    const optionItemsQuery = query(optionItemsRef, where("option_id", "==", optionRef)); // 🔹 เช็ค reference
    const optionItemsSnapshot = await getDocs(optionItemsQuery);

    for (const docSnap of optionItemsSnapshot.docs) {
      await deleteDoc(doc(db, "optionItems", docSnap.id));
    }

    // 2️⃣ ลบเอกสารจาก productOptions ที่ option_id เป็น array ที่มี reference ตรงกัน
    const productOptionsRef = collection(db, "productOptions");
    const productOptionsQuery = query(productOptionsRef, where("option_id", "array-contains", optionRef)); // 🔹 เช็ค array ของ reference
    const productOptionsSnapshot = await getDocs(productOptionsQuery);

    for (const docSnap of productOptionsSnapshot.docs) {
      await deleteDoc(doc(db, "productOptions", docSnap.id));
    }

    // 3️⃣ ลบเอกสารจาก options
    await deleteDoc(optionRef);

    ;
  } catch (error) {
    ;
  }
};
