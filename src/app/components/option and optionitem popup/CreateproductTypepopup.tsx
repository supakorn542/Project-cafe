import React, { useState } from "react";
import { db } from "../../lib/firebase"; // Import Firebase config
import { collection, addDoc } from "firebase/firestore";

function CreateProductTypePopup({ onClose }: { onClose: () => void }) {
  const [productTypeName, setProductTypeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateProductType = async () => {
    if (!productTypeName.trim()) {
      alert("Please enter a product type name.");
      return;
    }

    try {
      setLoading(true);
      // เพิ่มข้อมูลลง Firestore
      await addDoc(collection(db, "productTypes"), {
        name: productTypeName,
        description: description || "",
        createdAt: new Date(),
      });

      alert("Product Type created successfully!");
      onClose(); // ปิด popup หลังจากสร้างเสร็จ
    } catch (error) {
      console.error("Error creating product type:", error);
      alert("Failed to create product type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Create Product Type</h2>
        <div style={styles.formGroup}>
          <label>Product Type Name</label>
          <input
            type="text"
            value={productTypeName}
            onChange={(e) => setProductTypeName(e.target.value)}
            placeholder="Enter product type name"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            style={styles.textarea}
          />
        </div>
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.buttonCancel} disabled={loading}>
            Cancel
          </button>
          <button onClick={handleCreateProductType} style={styles.buttonSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  buttonCancel: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonSubmit: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CreateProductTypePopup;
