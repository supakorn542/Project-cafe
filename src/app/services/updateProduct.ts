import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import axios from "axios";

export const updateProduct = async (
productId: string, productName: string, description: string, price: number, calorie: number, selectProductType: string, selectedStatus: string, selectedOptions: { option: { id: string; }; }[], imageFile?: File | null) => {

  let imageUrl = null;
     // 1. อัปโหลดรูปภาพไปยัง Cloudinary ก่อน (ถ้ามี)
     if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          try {
            const response = await axios.post("/api/uploads", {
              image: base64Image,
              publicId: `product_pics/${productName}`,
              folder: "product_pics",
              
            });

            if (response.data.url) {
              imageUrl = response.data.url;
              console.log("Image uploaded successfully:", imageUrl);
            } else {
              console.error("Failed to upload image");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
          } finally {
            resolve(); // Resolve the promise after upload attempt
          }
        };
      });
    }

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
     imageProduct: imageUrl,
     updateAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};
