import React, { useState } from "react";
import { createOption } from "@/app/services/options";

const CreateOptionPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [optionName, setOptionName] = useState(""); // เก็บชื่อ option
  const [isRequired, setIsRequired] = useState(false); // ระบุว่าจำเป็นต้องเลือกหรือไม่
  const [optionItems, setOptionItems] = useState<
    { name: string; pricemodifier: number }[]
  >([]); // เก็บรายการช้อยส์
  const [newItemName, setNewItemName] = useState(""); // ชื่อของช้อยส์ใหม่
  const [newItemPriceModifier, setNewItemPriceModifier] = useState<number>(0); // ราคาเพิ่มลดของช้อยส์ใหม่

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      alert("กรุณาใส่ชื่อช้อยส์");
      return;
    }

    setOptionItems((prev) => [
      ...prev,
      { name: newItemName, pricemodifier: newItemPriceModifier },
    ]);
    setNewItemName(""); // ล้าง input หลังเพิ่ม
    setNewItemPriceModifier(0); // รีเซ็ตตัวปรับราคา
  };

  const handleRemoveItem = (index: number) => {
    setOptionItems((prev) => prev.filter((_, i) => i !== index)); // ลบ item ตาม index
  };

  const handleCreateOption = async () => {
    if (!optionName.trim()) {
      alert("กรุณาใส่ชื่อตัวเลือก");
      return;
    }

    const optionData = {
      id: "",
      name: optionName,
      require: isRequired,
    };

    try {
      const optionId = await createOption(optionData, optionItems); // ส่งข้อมูลไปยังฟังก์ชัน createOption
      console.log("Created option with ID: ", optionId);
      onClose(); // ปิด popup หลังบันทึกสำเร็จ
    } catch (error) {
      console.error("Error while creating option: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-4">
          สร้างตัวเลือก
        </h2>

        {/* Input สำหรับชื่อตัวเลือก */}
        <div className="mb-4">
          <label
            htmlFor="optionName"
            className="block font-medium text-gray-700"
          >
            ชื่อตัวเลือก
          </label>
          <input
            type="text"
            id="optionName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
          />
        </div>

        {/* Checkbox สำหรับตัวเลือกเพิ่มเติม */}
        <div className="mb-4 flex items-center">
          <input
            id="isRequired"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />
          <label
            htmlFor="isRequired"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            ต้องระบุ
          </label>
        </div>

        {/* รายการตัวเลือก (Choices) */}
        <div className="mb-4">
          <strong className="block text-gray-700">ตัวเลือกเสริม</strong>
          <ul>
            {optionItems.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <span className="flex-grow">
                  {item.name} (ราคา: {item.pricemodifier})
                </span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
          <div className="flex mt-2">
            <input
              type="text"
              placeholder="ชื่อช้อยส์"
              className="flex-grow mr-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <input
              type="number"
              placeholder="ปรับราคา"
              className="w-24 mr-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newItemPriceModifier}
              onChange={(e) => setNewItemPriceModifier(Number(e.target.value))}
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-black hover:bg-white text-white hover:text-black border border-black font-bold py-2 px-4 rounded"
            >
              เพิ่ม
            </button>
          </div>
        </div>

        {/* ปุ่ม Action */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleCreateOption}
            className="bg-black hover:bg-white text-white hover:text-black border border-black font-bold py-2 px-4 rounded"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOptionPopup;
