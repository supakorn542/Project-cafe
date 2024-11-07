import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { productTypeInterface } from '../interfaces/productType';

// ฟังก์ชันดึงข้อมูล categories
export const getProductTypes = async (): Promise<productTypeInterface[]> => {
  const productTypesCol = collection(db, 'productTypes');
  const productTypeSnapshot = await getDocs(productTypesCol);
  const productTypes = productTypeSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
  }));
  return productTypes;
};
