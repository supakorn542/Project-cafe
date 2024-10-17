import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../interfaces/product';
import { Admin } from '../interfaces/admin';
import { Category } from '../interfaces/category';

export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'product');
  const productSnapshot = await getDocs(productsCol);

  // ใช้ getDoc เพื่อดึงข้อมูลจาก reference admin_id และ category_id
  const products = await Promise.all(productSnapshot.docs.map(async (docSnapshot) => {
    const data = docSnapshot.data();
    
    // ตรวจสอบและดึงข้อมูลจาก reference admin_id
    const adminRef = data.admin_id;
    let admin_id = '';

    if (adminRef) {
      const adminDoc = await getDoc(adminRef);
      admin_id = adminDoc.id; // ดึง ID จาก reference
    }

    // ตรวจสอบและดึงข้อมูลจาก reference category_id
    const categoryRef = data.category_id;
    let category_id = '';

    if (categoryRef) {
      const categoryDoc = await getDoc(categoryRef);
      category_id = categoryDoc.id; // ดึง ID จาก reference
    }

    return {
      id: docSnapshot.id,
      admin_id: admin_id || '', // ใช้ค่า ID ที่ดึงมา
      category_id: category_id || '', // ใช้ค่า ID ที่ดึงมา
      description: data.description || '',
      price: data.price || 0,
      product_name: data.product_name || ''
    } as Product;
  }));

  return products;
};


export const getAdmins = async (): Promise<Admin[]> => {
  const adminsCol = collection(db, 'admin');
  const adminSnapshot = await getDocs(adminsCol);
  return adminSnapshot.docs.map(doc => ({
    id: doc.id,
    username: doc.data().username || '',    
    password: doc.data().password || '',      
    firstname: doc.data().firstname || '',    
    lastname: doc.data().lastname || '',      
    phone_number: doc.data().phone_number || '', 
    address: doc.data().address || '',        
  }));
};

export const getCategories = async (): Promise<Category[]> => {
  const categoriesCol = collection(db, 'category');
  const categorySnapshot = await getDocs(categoriesCol);
  return categorySnapshot.docs.map(doc => ({
    id: doc.id,
    category_name: doc.data().category_name || '' // ใช้ catagory_name ที่ตรงกับอินเทอร์เฟซ
  }));
};






// ฟังก์ชันดึงข้อมูล product ที่มี reference
// export const getProducts = async () => {
//   const productsCol = collection(db, 'products');
//   const productSnapshot = await getDocs(productsCol);

//   const products = await Promise.all(productSnapshot.docs.map(async (docSnapshot) => {
//     const data = docSnapshot.data();

//     // ดึงข้อมูล admin จาก reference
//     const adminRef = data.admin_id;
//     const adminDoc = await getDoc(adminRef);
//     const adminData = adminDoc.data();

//     // ดึงข้อมูล category จาก reference
//     const categoryRef = data.category_id;
//     const categoryDoc = await getDoc(categoryRef);
//     const categoryData = categoryDoc.data();

//     return {
//       id: docSnapshot.id,
//       admin: adminData ? `${adminData.firstname} ${adminData.lastname}` : 'Unknown',
//       category: categoryData ? categoryData.category_name : 'Unknown',
//       description: data.description,
//       price: data.price,
//       product_name: data.product_name
//     };
//   }));

//   return products;
// };