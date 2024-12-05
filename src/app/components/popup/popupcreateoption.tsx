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
      id : "",
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
      <h2 style={{ textAlign: "center" }}>สร้างตัวเลือก</h2>
      {/* Input สำหรับชื่อตัวเลือก */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>ชื่อตัวเลือก</strong>
        </label>
        <input
          type="text"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      {/* Checkbox สำหรับตัวเลือกเพิ่มเติม */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />{" "}
          ต้องระบุ
        </label>
      </div>
      {/* รายการตัวเลือก (Choices) */}
      <div style={{ marginBottom: "10px" }}>
        <strong>ตัวเลือกเสริม</strong>
        {optionItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ flex: 1 }}>{item.name} (ราคา: {item.pricemodifier})</span>
            <button
              onClick={() => handleRemoveItem(index)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              ลบ
            </button>
          </div>
        ))}
        <div style={{ display: "flex", marginTop: "10px" }}>
          <input
            type="text"
            placeholder="ชื่อช้อยส์"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          />
          <input
            type="number"
            placeholder="ปรับราคา"
            value={newItemPriceModifier}
            onChange={(e) => setNewItemPriceModifier(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleAddItem}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            เพิ่ม
          </button>
        </div>
      </div>
      {/* ปุ่ม Action */}
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
          ยกเลิก
        </button>
        <button
          onClick={handleCreateOption}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default CreateOptionPopup;
  