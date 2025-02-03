import React, { useEffect, useState } from "react";
import {
  doc,

  collection,

  writeBatch,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { getOptionItemsByOptionId } from "@/app/services/optionItem";

interface OptionItem {
  id: string;
  name: string;
  priceModifier: number;
}

interface OptionItemPopupProps {
  option: { id: string; name: string; require: boolean };
  onClose: () => void;
  
  
}

const OptionItemPopup: React.FC<OptionItemPopupProps> = ({
  option,

  onClose,
}) => {
  const [optionItems, setOptionItems] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newOptionName, setNewOptionName] = useState<string>(option.name);
  const [isRequire, setIsRequire] = useState<boolean>(option.require);
  const [pendingAddItems, setPendingAddItems] = useState<OptionItem[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  useEffect(() => {
    const fetchOptionItems = async () => {
      try {
        const items = await getOptionItemsByOptionId(option.id);
        setOptionItems(items);
      } catch (error) {
        ;
      } finally {
        setLoading(false);
      }
    };

    fetchOptionItems();
  }, [option.id]);

  const handleAddOptionItem = (name: string, price: number) => {
    const newItem = { id: "", name, priceModifier: price }; // Temporary ID
    setPendingAddItems((prev) => [...prev, newItem]);
    setOptionItems((prev) => [...prev, newItem]);
  };

  const handleDeleteOptionItem = (itemId: string) => {
    setPendingDeleteIds((prev) => [...prev, itemId]);
    setOptionItems((prev) => prev.filter((item) => item.id !== itemId));
  };
  

  const handleSaveChanges = async () => {
    try {
      const batch = writeBatch(db);

      // Update option name and require
      const optionRef = doc(db, "options", option.id);
      batch.update(optionRef, { name: newOptionName, require: isRequire });

      // Add new option items
      const optionItemsCollection = collection(db, "optionItems");
      pendingAddItems.forEach((item) => {
        const newItemRef = doc(optionItemsCollection);
        batch.set(newItemRef, {
          name: item.name,
          pricemodifier: item.priceModifier,
          option_id: optionRef,
        });
      });

      // Delete removed option items
      pendingDeleteIds.forEach((id) => {
        const itemRef = doc(db, "optionItems", id);
        batch.delete(itemRef);
      });

      // Commit all changes
      await batch.commit();

      alert("Changes saved successfully!");
      onClose();
    } catch (error) {
      ;
      alert("Failed to save changes. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          สร้างตัวเลือก
        </h2>
        <div className="mb-4">
          <label htmlFor="optionName" className="block text-sm font-medium text-gray-700">
            ชื่อตัวเลือก
          </label>
          <input
            type="text"
            id="optionName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
          />
        </div>
        <div className="flex items-start mb-4">
          <div className="flex items-center h-5">
            
            <input
              id="require"
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={isRequire}
              onChange={(e) => setIsRequire(e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="require" className="font-medium text-gray-700">
              ต้องระบุ
            </label>
          </div>
        </div>
        <hr className="my-4" />
        <h3 className="text-lg font-semibold mb-4">
          ช้อยส์
        </h3>
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <ul className="mb-4">
            {optionItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2">
                <span>{item.name}</span>
                <span>{item.priceModifier} $</span>
                <button
                  type="button"
                  onClick={() => handleDeleteOptionItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center  justify-between mb-4">
          <input
            type="text"
            placeholder="เพิ่มช้อยส์"
            className=" border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
           <input
              type="number"
              placeholder="ราคา"
              className="w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
            />
          <button
          type="button"
            onClick={() => handleAddOptionItem(newItemName, newItemPrice)}
            className="bg-black  text-white font-bold py-2 px-4 rounded"
          >
            เพิ่ม
          </button>
        </div>
        <div className="flex justify-end">
          <button
          type="button"
            onClick={onClose}
            className="mr-2 bg-white border border-black hover:bg-red-200 text-black font-bold py-2 px-4 rounded"
          >
            ยกเลิก
          </button>
          <button
          type="button"
            onClick={handleSaveChanges}
            className="bg-black hover:bg-white border border-black text-white hover:text-black font-bold py-2 px-4 rounded"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionItemPopup;
