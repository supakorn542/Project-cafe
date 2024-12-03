import React, { useState } from "react";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import CreateOptionPopup from "./popupcreateoption";

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
          <input
            type="checkbox"
            checked={selectedOptions.some(
              (selected) => selected.option.id === option.id
            )}
            onChange={() => onOptionChange(option)}
          />
          <label>{option.name}</label>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ปิด
        </button>
        <button
          onClick={handleOpenCreateOptionPopup}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
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