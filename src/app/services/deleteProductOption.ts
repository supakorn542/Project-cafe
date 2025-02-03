import { doc, getDocs, collection, query, where, updateDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const deleteArrayOptionByProductId = async (productId: string, optionId: string) => {
  try {
    // Reference ไปยัง collection productOptions
    const productOptionsRef = collection(db, "productOptions");

    // ค้นหา document ที่มี product_id ตรงกับ productRef
    const productRef = doc(db, "products", productId);
    const q = query(productOptionsRef, where("product_id", "==", productRef));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // ดึง document แรกจากผลลัพธ์เพื่อทำการลบ option_id ที่ต้องการ
      const docSnapshot = querySnapshot.docs[0];
      await updateDoc(docSnapshot.ref, {
        option_id: arrayRemove(doc(db, "options", optionId)),
      });
      ;
    } else {
      ;
    }
  } catch (error) {
    ;
  }
};


export const deleteProductOptionsByProductId = async (productId: string) => {
  try {
    const productOptionsRef = collection(db, "productOptions");
    const productRef = doc(db, "products", productId);
    const q = query(productOptionsRef, where("product_id", "==", productRef)); // กรองเอกสารด้วย product_id
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(docSnap.ref) // ลบแต่ละเอกสาร
      );

      await Promise.all(deletePromises); // รอให้การลบทั้งหมดเสร็จสิ้น
      ;
    } else {
      ;
    }
  } catch (error) {
    ;
    throw error; // ส่ง error กลับเพื่อจัดการภายนอก
  }
};