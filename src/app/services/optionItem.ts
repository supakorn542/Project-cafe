import { collection, deleteDoc, doc,  getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from "../../app/lib/firebase";
import { OptionItem } from "../interfaces/optionItemInterface";

export const getOptionItemsByOptionId = async (optionId: string): Promise<OptionItem[]> => {
    try {

        const optionRef = doc(db, "options", optionId);
      const optionItemsRef = collection(db, "optionItems");
      const q = query(optionItemsRef, where("option_id", "==", optionRef));
      const querySnapshot = await getDocs(q);
  
      const items: OptionItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as OptionItem;
        return {
          ...data,
          id: doc.id,
        };
      });
  
      return items;
    } catch (error) {
      ;
      throw error;
    }
  };


// อัปเดตข้อมูล Option Item
export const updateOptionItem = async (optionId: string, itemId: string, data: Partial<{ name: string; pricemodifier: number }>) => {
  const itemRef = doc(db, `options/${optionId}/items`, itemId);
  await updateDoc(itemRef, data);
};

// ลบ Option Item
export const deleteOptionItem = async (optionId: string, itemId: string) => {
  const itemRef = doc(db, `options/${optionId}/items`, itemId);
  await deleteDoc(itemRef);
};
