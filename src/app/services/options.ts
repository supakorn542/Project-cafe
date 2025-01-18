import { addDoc, collection, doc, getDocs, writeBatch } from 'firebase/firestore';
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
              pricemodifier: data.pricemodifier || 0,
              option_id: optionId // เพิ่ม option_id ลงใน OptionItem
          });
      }
  });


    return { options: optionsData, optionItemsMap: optionItemsMapTemp };
};


// สร้าง option โดยมีการสร้าง optionitem เข้าไปด้วย
export const createOption = async (
  data: OptionInterface,
  optionItems?: { name: string; pricemodifier: number }[]
) => {
  try {
    // 1. เพิ่มเอกสารใหม่ใน collection "options"
    const addOption = await addDoc(collection(db, "options"), {
      name: data.name,
      require: data.require,
    });

    console.log("Option created with ID: ", addOption.id);

    // 2. ถ้ามี optionItems ให้บันทึกข้อมูลใน collection "optionItems"
    if (optionItems && optionItems.length > 0) {
      const batch = writeBatch(db); // สร้าง batch สำหรับเพิ่มข้อมูลหลายรายการพร้อมกัน

      optionItems.forEach((item) => {
        const newOptionItemRef = doc(collection(db, "optionItems"));
        batch.set(newOptionItemRef, {
          name: item.name,
          option_id: doc(db, "options", addOption.id), // บันทึก `option_id` เป็น id ของ option
          pricemodifier: item.pricemodifier,
        });
      });

      // Commit batch
      await batch.commit();
      console.log("Option items saved successfully!");
    }

    // คืนค่า `id` ของ option ที่สร้าง
    return addOption.id;
  } catch (error) {
    console.error("Error creating option: ", error);
    throw error; // ส่ง error กลับไปให้ฟังก์ชันที่เรียกใช้งาน
  }
};