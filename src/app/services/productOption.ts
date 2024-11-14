// services/getProductOptions.ts
import { db } from "../lib/firebase"; // Import Firestore instance
import { collection, query, where, getDocs, DocumentReference, doc, updateDoc, arrayUnion } from "firebase/firestore"; 

export const getProductOptionsByProductId = async (productId: string) => {
    const productOptionsRef = collection(db, "productOptions");
  
    // ใช้ doc() เพื่อสร้าง reference ของ product
    const productRef = doc(db, "products", productId);
    console.log("productId in service:", productId);
    console.log("productRef in service:", productRef);

    const q = query(productOptionsRef, where("product_id", "==", productRef)); // เทียบกับ reference
    const querySnapshot = await getDocs(q);
    console.log("querySnapshot in service:", querySnapshot);

    const optionIds = querySnapshot.docs.flatMap((doc) => {
      const data = doc.data();
      console.log("dataaa: ", data);

      // ตรวจสอบว่า option_id เป็น array ของ DocumentReference
      if (Array.isArray(data.option_id)) {
        return data.option_id.map((optionRef) => optionRef.id); // ดึงเฉพาะ id ของแต่ละ reference
      } else {
        return [];
      }
    });

    console.log("optionIds in service:", optionIds);
    return optionIds;
};

export const addProductOption = async (productId: string, optionId: string) => {
  try {
    // Reference ไปยัง collection productOptions
    const productOptionsRef = collection(db, "productOptions");

    // ค้นหา document ที่มี product_id ตรงกับ productRef
    const productRef = doc(db, "products", productId);
    const q = query(productOptionsRef, where("product_id", "==", productRef));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // ดึง document แรกจากผลลัพธ์เพื่อเพิ่ม option_id ที่ต้องการ
      const docSnapshot = querySnapshot.docs[0];
      await updateDoc(docSnapshot.ref, {
        option_id: arrayUnion(doc(db, "options", optionId)),
      });
      console.log("Option added successfully!");
    } else {
      console.log("No matching document found for the given product_id.");
    }
  } catch (error) {
    console.error("Error adding option:", error);
  }
};
