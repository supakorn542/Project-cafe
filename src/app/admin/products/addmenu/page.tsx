"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../../../lib/services/getCategory";
import { addCoffeeOption } from "../../../lib/services/addcoffeeOption"; 
import { createProduct } from "../../../lib/services/addProduct"; // ฟังก์ชันสำหรับบันทึก product

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [adminId, setAdminId] = useState("");
  const [categories, setCategories] = useState<
    { id: string; category_name: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [intensity, setIntensity] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. บันทึก product ก่อน
    const productData = {
      admin_id: "SdVAeQFloBoDUfQ65bt6", // ค่า admin id ตัวอย่าง
      category_id: selectedCategory,
      description,
      price,
      product_name: productName,
    };

    try {
      // บันทึกข้อมูลลง collection products และได้ product_id กลับมา
      const productRef = await createProduct(productData);
      const productId = productRef.id;

      // 2. บันทึก coffee_option โดยใช้ product_id
      const coffeeOptionData = {
        product_id: productId, // ใช้ product_id ที่เพิ่งสร้าง
        intensity,
        sweetness,
      };
      await addCoffeeOption(coffeeOptionData);

      console.log("Coffee option created with product ID: ", productId);
    } catch (error) {
      console.error("Error creating product or coffee option: ", error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); 
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (intensity.includes(value)) {
      setIntensity(intensity.filter((item) => item !== value));
    } else {
      setIntensity([...intensity, value]);
    }
  };

  const handleSweetnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (sweetness.includes(value)) {
      setSweetness(sweetness.filter((item) => item !== value));
    } else {
      setSweetness([...sweetness, value]);
    }
  };

  return (
    <div>
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

        <label>Intensity</label>
        <div>
          <input
            type="checkbox"
            value="คั่วอ่อน (Ethiopai)"
            onChange={handleIntensityChange}
          />
          คั่วอ่อน (Ethiopai)
          <input
            type="checkbox"
            value="คั่วกลาง (Brazil + Colombia)"
            onChange={handleIntensityChange}
          />
          คั่วกลาง (Brazil + Colombia)
          <input
            type="checkbox"
            value="คั่วเข้ม (ปางขอน)"
            onChange={handleIntensityChange}
          />
          คั่วเข้ม (ปางขอน)
        </div>

        <label>Sweetness</label>
        <div>
          <input
            type="checkbox"
            value="ไม่ใส่ไซรัป"
            onChange={handleSweetnessChange}
          />
          ไม่ใส่ไซรัป
          <input
            type="checkbox"
            value="ไซรัป 10 ml หวานนิดเดียว"
            onChange={handleSweetnessChange}
          />
          ไซรัป 10 ml หวานนิดเดียว
        </div>

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
