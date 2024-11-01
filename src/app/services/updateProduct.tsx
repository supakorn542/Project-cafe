import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // อ้างอิง Firebase

// ยังไม่ได้ลองว่าใช้งานได้รึป่าว
// ฟังก์ชันสำหรับการแก้ไขข้อมูลผลิตภัณฑ์
export const updateProduct = async (productId: string, updatedData: {
  admin_id?: string; // รับ admin_id ใหม่ที่เป็น string (document ID)
  category_id?: string; // รับ category_id ใหม่ที่เป็น string (document ID)
  description?: string;
  price?: number;
  product_name?: string;
}) => {
  try {
    // สร้าง reference ไปยังเอกสารผลิตภัณฑ์ที่ต้องการแก้ไข
    const productRef = doc(db, 'products', productId);

    const updatedFields: any = {};

    // สร้าง reference ของ admin ถ้ามีการส่งค่า admin_id ใหม่
    if (updatedData.admin_id) {
      updatedFields.admin_id = doc(db, 'admin', updatedData.admin_id);
    }

    // สร้าง reference ของ category ถ้ามีการส่งค่า category_id ใหม่
    if (updatedData.category_id) {
      updatedFields.category_id = doc(db, 'category', updatedData.category_id);
    }

    // อัปเดตฟิลด์อื่นๆ ที่ไม่ใช่ reference
    if (updatedData.description) updatedFields.description = updatedData.description;
    if (updatedData.price) updatedFields.price = updatedData.price;
    if (updatedData.product_name) updatedFields.product_name = updatedData.product_name;

    // อัปเดตข้อมูลใน Firestore
    await updateDoc(productRef, updatedFields);

    console.log('Document successfully updated');
  } catch (error) {
    console.error('Error updating document: ', error);
  }
};
