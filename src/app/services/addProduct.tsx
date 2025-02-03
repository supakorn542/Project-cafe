import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../interfaces/product';

import axios from 'axios';

// ฟังก์ชันสำหรับการสร้างข้อมูลผลิตภัณฑ์ใหม่พร้อมกับ option หลายตัวในฟิลด์เดียว
export const createProductWithOptions = async (productData: Product, imageFile: File | null) => {
  try {
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
              publicId: `product_pics/${productData?.name}`,
              folder: "product_pics",
              // (Optional) You can generate a dynamic publicId here if needed
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

    // สร้าง reference ของ status และ productType
    const productTypeRef = doc(db, 'productTypes', productData.productType_id);
    const statusRef = doc(db, 'status', productData.status_id);

    // บันทึกข้อมูล product ลง Firestore
    const productDocRef = await addDoc(collection(db, "products"), {
      description : productData.description,
      status_id: statusRef,
      productType_id: productTypeRef,
      calorie: productData.calorie,
      price: productData.price,
      name: productData.name,
      imageProduct:imageUrl,
      createAt : new Date()
    });

    // สร้าง array ของ reference ที่อ้างถึง options ที่ถูกเลือก
    const optionRefs = productData.options?.map(optionId => doc(db, 'options', optionId));

    // บันทึก productOptions ลงใน collection productOptions โดยเก็บ option_id เป็น array ของ reference
    await addDoc(collection(db, "productOptions"), {
      product_id: productDocRef, // ใช้ reference ของ product ที่เพิ่งสร้าง
      option_id: optionRefs,     // Array ของ reference ไปยัง options ที่เลือกไว้
    });

    return productDocRef; // คืนค่า DocumentReference ของ product ที่สร้างขึ้น
  } catch (e) {
    ;
    throw e;
  }
};
