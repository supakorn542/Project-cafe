import { getOptionItemsByOptionId } from "@/app/services/optionItem";
import React, { useEffect, useState } from "react";
import { doc, deleteDoc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"; // ใช้ setDoc ในการเพิ่มเอกสาร
import { db } from "@/app/lib/firebase"; // เชื่อมต่อกับ Firestore

interface OptionItem {
  id: string;
  name: string;
  pricemodifier: number;
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
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newOptionName, setNewOptionName] = useState<string>(option.name); // ใช้ state เพื่อเก็บชื่อที่จะแก้ไข
  const [isRequire, setIsRequire] = useState<boolean>(option.require); // ใช้ state สำหรับ checkbox require


  useEffect(() => {
    const fetchOptionItems = async () => {
      try {
        const items = await getOptionItemsByOptionId(option.id);
        setOptionItems(items);
      } catch (error) {
        console.error("Error fetching option items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptionItems();
  }, [option.id]);
  const handleUpdateOptionName = async () => {
    try {
      // สร้าง reference ของ document ใน Firestore ที่ต้องการแก้ไข
      const optionRef = doc(db, "options", option.id);

      // ใช้ updateDoc เพื่ออัปเดตชื่อและค่า require
      await updateDoc(optionRef, {
        name: newOptionName,
        require: isRequire, // อัปเดตค่า require ด้วย
      });

      // ปิด popup เมื่ออัปเดตเสร็จ
      onClose();
    } catch (error) {
      console.error("Error updating option name:", error);
    }
  };
  // ฟังก์ชันสำหรับลบ OptionItem
  const handleDeleteOptionItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "optionItems", itemId));
      setOptionItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Error deleting option item:", error);
    }
  };

  // ฟังก์ชันสำหรับเพิ่ม OptionItem ใหม่
  const handleAddOptionItem = async () => {
    if (!newItemName || newItemPrice < 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const newOptionItem = {
      name: newItemName,
      pricemodifier: newItemPrice,
      option_id: doc(db, "options", option.id), // เชื่อมโยงกับ Option ที่เลือก
    };

    try {
      // ใช้ addDoc เพื่อเพิ่มเอกสารใหม่ให้ Firestore สร้าง docId ให้เอง
      const optionItemsCollection = collection(db, "optionItems"); // เรียก collection "optionItems"
      const docRef = await addDoc(optionItemsCollection, newOptionItem); // เพิ่มเอกสารใหม่และให้ Firestore สร้าง docId อัตโนมัติ

      // อัปเดต optionItems ใน state
      setOptionItems((prevItems) => [
        ...prevItems,
        { id: docRef.id, ...newOptionItem }, // ใช้ docRef.id ที่ Firestore สร้างให้
      ]);

      // รีเซ็ตค่าใหม่หลังจากการเพิ่มเสร็จ
      setNewItemName("");
      setNewItemPrice(0);
    } catch (error) {
      console.error("Error adding option item:", error);
    }
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
        <div>
        <label>ชื่อ Option:</label>
        <input
          type="text"
          value={newOptionName}
          onChange={(e) => setNewOptionName(e.target.value)} // อัปเดต state เมื่อมีการเปลี่ยนแปลง
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={isRequire} // ค่าเริ่มต้นของ checkbox จากค่า require
            onChange={(e) => setIsRequire(e.target.checked)} // เมื่อ checkbox เปลี่ยนค่า
          />
          ต้องระบุ
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleUpdateOptionName}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          บันทึกการแก้ไข
        </button>
        </div>
        <h2>รายการ Option Items สำหรับ {option.name}</h2>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <ul>
          {optionItems.length > 0 ? (
            optionItems.map((item) => (
              <li key={item.id}>
                {item.name} - ราคา: {item.pricemodifier}
                <button
                  onClick={() => handleDeleteOptionItem(item.id)}
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  ลบ
                </button>
              </li>
            ))
          ) : (
            <p>ไม่มี Option Items สำหรับตัวเลือกนี้</p>
          )}
        </ul>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>เพิ่มตัวเลือกใหม่</h3>
        <input
          type="text"
          placeholder="ชื่อตัวเลือก"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          style={{
            padding: "8px",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(Number(e.target.value))}
          style={{
            padding: "8px",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleAddOptionItem}
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          เพิ่ม
        </button>
      </div>

      <button
        onClick={onClose}
        style={{
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        ปิด
      </button>
    </div>
  );
};

export default OptionItemPopup;
