import React, { useState } from "react";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import CreateOptionPopup from "./popupcreateoption";
import OptionItemPopup from "./OptionItemPopup";

interface OptionItem {
  id: string;
  name: string;
  pricemodifier: number;
}

interface SelectOptionsPopupProps {
  options: OptionInterface[];
  selectedOptions: { option: OptionInterface; items: OptionItem[] }[];
  optionItemsMap: { [key: string]: OptionItem[] };
  onOptionChange: (option: OptionInterface) => void;
  onCreateOption: () => void;
  onClose: () => void;
}

const SelectOptionsPopup: React.FC<SelectOptionsPopupProps> = ({
  options,
  selectedOptions,
  optionItemsMap,
  onOptionChange,
  onCreateOption,
  onClose,
}) => {
  const [isCreateOptionPopupOpen, setIsCreateOptionPopupOpen] = useState(false);
  const [selectedOptionForUpdate, setSelectedOptionForUpdate] =
    useState<OptionInterface | null>(null);
  const handleUpdateOption = (option: OptionInterface) => {
    setSelectedOptionForUpdate(option); // เปิด popup เพื่อแสดงรายการ option items
  };
  const handleCloseOptionItemPopup = () => {
    setSelectedOptionForUpdate(null); // ปิด popup
  };
  const handleOpenCreateOptionPopup = () => {
    setIsCreateOptionPopupOpen(true);
  };

  const handleCloseCreateOptionPopup = () => {
    setIsCreateOptionPopupOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        width: "400px",
        zIndex: 1000,
      }}
    >
      <h2 style={{ textAlign: "center" }}>เลือกตัวเลือก</h2>
      {options.map((option) => (
        <div key={option.id}>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 items-center">
            <input
            className="w-4 h-4"
              type="checkbox"
              checked={selectedOptions.some(
                (selected) => selected.option.id === option.id
              )}
              onChange={() => onOptionChange(option)}
              />
            <label>{option.name}</label>
              </div>
            <button onClick={() => handleUpdateOption(option)}>อัปเดท</button>
          </div>
          <svg
            className="w-full my-4"
            height="1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="#D1D5DB"
              strokeWidth="1"
            />
          </svg>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button
          onClick={onClose}
           className="text-black border border-black rounded-md px-4 py-2 hover:bg-black hover:text-white"
        >
          ปิด
        </button>
        {selectedOptionForUpdate && (
          <OptionItemPopup
            option={{
              id: selectedOptionForUpdate.id!, // แปลงเป็น string แน่นอน
              name: selectedOptionForUpdate.name,
              require: selectedOptionForUpdate.require,
            }}
            onClose={handleCloseOptionItemPopup}
          />
        )}

        <button
          onClick={handleOpenCreateOptionPopup}
          className="bg-black text-white border border-black rounded-md px-4 py-2 hover:bg-white hover:text-black"          
        >
          สร้างตัวเลือกใหม่
        </button>
      </div>

      {/* Popup สำหรับสร้างตัวเลือกใหม่ */}
      <CreateOptionPopup
        isOpen={isCreateOptionPopupOpen}
        onClose={handleCloseCreateOptionPopup}
      />
    </div>
  );
};

export default SelectOptionsPopup;
