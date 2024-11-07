import { collection, getDocs } from 'firebase/firestore';
import { OptionInterface } from '../interfaces/optioninterface';
import { OptionItem } from '../interfaces/optionItemInterface'; // Use the correct casing
import { db } from '../lib/firebase';

export const getOptions = async (): Promise<{ options: OptionInterface[], optionItemsMap: { [key: string]: OptionItem[] } }> => {
  // Fetch options
  const optionsCol = collection(db, "options");
  const optionsSnapshot = await getDocs(optionsCol);
  const optionsData: OptionInterface[] = optionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "",
      require: doc.data().require || false,
  }));

  // Map to store optionItems
  const optionItemsMapTemp: { [key: string]: OptionItem[] } = {};

  // Fetch optionItems
  const optionItemsCol = collection(db, "optionItems");
  const optionItemsSnapshot = await getDocs(optionItemsCol);
  optionItemsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log('data :' ,data)
      const optionId = data.option_id?.id; // ใช้ .id เพื่อเข้าถึง reference
      if (optionId) {
          if (!optionItemsMapTemp[optionId]) {
              optionItemsMapTemp[optionId] = [];
          }
          optionItemsMapTemp[optionId].push({
              id: doc.id,
              name: data.name || '',
              priceModifier: data.pricemodifier || 0,
              option_id: optionId // เพิ่ม option_id ลงใน OptionItem
          });
      }
  });


    return { options: optionsData, optionItemsMap: optionItemsMapTemp };
};