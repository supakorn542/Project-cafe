import { doc, getDocs, collection, query, where, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../lib/firebase";

export const deleteProductOption = async (productId: string, optionId: string) => {
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
      console.log("Option removed successfully!");
    } else {
      console.log("No matching document found for the given product_id.");
    }
  } catch (error) {
    console.error("Error removing option:", error);
  }
};
