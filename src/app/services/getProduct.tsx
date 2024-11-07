import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../interfaces/product';

import { productTypeInterface } from '../interfaces/productType';

export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);

  // ใช้ getDoc เพื่อดึงข้อมูลจาก reference admin_id และ category_id
  const products = await Promise.all(productSnapshot.docs.map(async (docSnapshot) => {
    const data = docSnapshot.data();
    
    // ตรวจสอบและดึงข้อมูลจาก reference user_id
    const userRef = data.user_id;
    let user_id = '';

    if (userRef) {
      const userDoc = await getDoc(userRef);
      user_id = userDoc.id; // ดึง ID จาก reference
    }

    const productTypeRef = data.productType_id;
    let productType_id = '';

    if (productTypeRef) {
      const productTypeDoc = await getDoc(productTypeRef);
      productType_id = productTypeDoc.id; // ดึง ID จาก reference
    }

    const statusRef = data.status_id;
    let status_id = '';

    if (statusRef) {
      const statusDoc = await getDoc(statusRef);
     status_id = statusDoc.id; // ดึง ID จาก reference
    }
//-----------------------------------------------------------------
    return {
      id: docSnapshot.id,
      user_id: user_id || '', 
      productType_id: productType_id || '',
      status_id: status_id || '',
      price: data.price || 0,
      name: data.name || '',
      calorie: data.calorie || ''
    } as Product;
  }));

  return products;
};




export const getProductType = async (): Promise<productTypeInterface[]> => {
  const categoriesCol = collection(db, 'productTypes');
  const categorySnapshot = await getDocs(categoriesCol);
  return categorySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name || '' // ใช้ catagory_name ที่ตรงกับอินเทอร์เฟซ
  }));
};




