import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // อ้างอิง Firebase

// ฟังก์ชันสำหรับการสร้างข้อมูลผลิตภัณฑ์ใหม่
export const createProduct = async (product: {
  admin_id: string; // รับค่าเป็น string แต่จะเปลี่ยนเป็น reference
  category_id: string; // รับค่าเป็น string แต่จะเปลี่ยนเป็น reference
  description: string;
  price: number;
  product_name: string;
}) => {
  try {
    // สร้าง reference ของ admin และ category
    const adminRef = doc(db, 'admin', product.admin_id);
    const categoryRef = doc(db, 'category', product.category_id);

    // เพิ่มข้อมูลผลิตภัณฑ์ใหม่ในคอลเลกชัน 'products'
    const docRef = await addDoc(collection(db, 'product'), {
      admin_id: adminRef || undefined, // เก็บเป็น reference
      category_id: categoryRef, // เก็บเป็น reference
      description: product.description,
      price: product.price,
      product_name: product.product_name
    });

    console.log('Document written with ID: ', docRef.id); // แสดง ID ของเอกสารที่เพิ่มเข้ามา
  } catch (e) {
    console.error('Error adding document: ', e); // แสดงข้อผิดพลาดถ้ามี
  }
};
