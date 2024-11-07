import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../interfaces/product';

// ฟังก์ชันสำหรับการสร้างข้อมูลผลิตภัณฑ์ใหม่พร้อมกับ option หลายตัวในฟิลด์เดียว
export const createProductWithOptions = async (productData: Product) => {
  try {
    // สร้าง reference ของ status และ productType
    const productTypeRef = doc(db, 'productTypes', productData.productType_id);
    const statusRef = doc(db, 'status', productData.status_id);

    // บันทึกข้อมูล product ลง Firestore
    const productDocRef = await addDoc(collection(db, "products"), {
      status_id: statusRef,
      productType_id: productTypeRef,
      calorie: productData.calorie,
      price: productData.price,
      name: productData.name,
    });

    // สร้าง array ของ reference ที่อ้างถึง options ที่ถูกเลือก
    const optionRefs = productData.options.map(optionId => doc(db, 'options', optionId));

    // บันทึก productOptions ลงใน collection productOptions โดยเก็บ option_id เป็น array ของ reference
    await addDoc(collection(db, "productOptions"), {
      product_id: productDocRef, // ใช้ reference ของ product ที่เพิ่งสร้าง
      option_id: optionRefs,     // Array ของ reference ไปยัง options ที่เลือกไว้
    });

    return productDocRef; // คืนค่า DocumentReference ของ product ที่สร้างขึ้น
  } catch (e) {
    console.error("Error adding product and productOptions: ", e);
    throw e;
  }
};
