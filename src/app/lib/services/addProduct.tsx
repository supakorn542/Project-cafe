import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // อ้างอิง Firebase

// ฟังก์ชันสำหรับการสร้างข้อมูลผลิตภัณฑ์ใหม่

export const createProduct = async (productData: {
  admin_id: string;
  category_id: string;
  description: string;
  base_price: number;
  product_name: string;
}) => {
  try {
      // สร้าง reference ของ admin และ category
      const adminRef = doc(db, 'admin', productData.admin_id);
      const categoryRef = doc(db, 'category', productData.category_id);
    // บันทึกข้อมูล product ลง Firestore
    const docRef = await addDoc(collection(db, "products"), {
      admin_id: adminRef,
      category_id: categoryRef,
      description: productData.description,
      base_price: productData.base_price,
      product_name: productData.product_name,
    });
    return docRef; // คืนค่า DocumentReference ซึ่งมี id ของ product ที่สร้างขึ้น
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};


  