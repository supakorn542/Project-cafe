import { doc, DocumentData, DocumentReference, FieldValue, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import axios from "axios";


export const updateProduct = async (
  productId: string,
  productName: string,
  description: string,
  price: number,
  calorie: number,
  selectProductType: string,
  selectedStatus: string,
  selectedOptions: { option: { id: string } }[],
  imageFile?: File | null
) => {
  let imageUrl: string | null = null;
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
            ;
          } else {
            ;
          }
        } catch (error) {
          ;
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
    const updatedData = {
      name: productName,
      description: description,
      price: price,
      calorie: calorie,
      productType_id: productTypeRef,
      status_id: statusRef,
      updateAt: serverTimestamp(),
    } as {
      name: string;
      description: string;
      price: number;
      calorie: number;
      productType_id: DocumentReference<DocumentData, DocumentData>;
      status_id: DocumentReference<DocumentData, DocumentData>;
      updateAt: FieldValue;
      imageProduct?: string; // Make imageProduct optional
    }; // Type assertion

    if (imageUrl) {
      updatedData.imageProduct = imageUrl;
    }


    await updateDoc(productRef, updatedData);
    return true;
  } catch (error) {
    ;
    throw new Error("Failed to update product");
  }
};
