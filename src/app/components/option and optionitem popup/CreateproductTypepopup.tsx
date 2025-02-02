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
        name: productTypeName.toLowerCase(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Create Product Type</h2>
        <div className="mb-4">
          <label
            htmlFor="productTypeName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Type Name
          </label>
          <input
            type="text"
            id="productTypeName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={productTypeName}
            onChange={(e) => setProductTypeName(e.target.value)}
            placeholder="Enter product type name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
          type="reset"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
          type="button"
            onClick={handleCreateProductType}
            className="bg-black hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProductTypePopup;
