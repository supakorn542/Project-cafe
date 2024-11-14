import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const updateProduct = async (
  productId: string,
  productName: string,
  description: string,
  price: number,
  calorie: number,
  selectProductType: string,
  selectedStatus: string,
  selectedOptions: { option: { id: string } }[]
) => {
  const productRef = doc(db, "products", productId);

  // สร้าง reference สำหรับ productType และ status
  const productTypeRef = doc(db, "productTypes", selectProductType);
  const statusRef = doc(db, "status", selectedStatus);

  try {
    await updateDoc(productRef, {
      name: productName,
      description: description,
      price: price,
      calorie: calorie,
      productType_id: productTypeRef,  // อัปเดตเป็น reference
      status_id: statusRef,            // อัปเดตเป็น reference
     
    });
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};
