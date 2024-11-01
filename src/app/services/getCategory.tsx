import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category } from '../interfaces/category';

// ฟังก์ชันดึงข้อมูล categories
export const getCategories = async (): Promise<Category[]> => {
  const categoriesCol = collection(db, 'category');
  const categorySnapshot = await getDocs(categoriesCol);
  const categories = categorySnapshot.docs.map(doc => ({
    id: doc.id,
    category_name: doc.data().category_name,
  }));
  return categories;
};
