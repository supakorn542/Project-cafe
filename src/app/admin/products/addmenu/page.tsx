"use client";

import { useEffect, useState } from "react";
import { createProduct } from "../../../lib/services/addProduct";
import { getCategories } from "../../../lib/services/getCategory";

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [adminId, setAdminId] = useState("");
  const [categories, setCategories] = useState<
    { id: string; category_name: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // ดึงข้อมูล categories เมื่อ component ถูกโหลด
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct({
      admin_id: "SdVAeQFloBoDUfQ65bt6",
      category_id: selectedCategory,
      description,
      price,
      product_name: productName,
    });
  };

  console.log("category: ",selectedCategory)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); // อัปเดตค่า category ที่ถูกเลือก
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        
      
        <label htmlFor="category">Select Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
