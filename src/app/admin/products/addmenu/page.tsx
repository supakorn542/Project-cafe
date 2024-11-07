"use client";

import { useEffect, useState } from "react";
import { getProductTypes } from "../../../services/getproductType";
import { createProductWithOptions } from "../../../services/addProduct";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { getOptions } from "@/app/services/options";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { statusInterface } from "@/app/interfaces/statusInterface";
import { getStatus } from "@/app/services/getstatus";

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<statusInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // เก็บค่าที่เลือก
  const [options, setOptions] = useState<OptionInterface[]>([]);
  const [optionItemsMap, setOptionItemsMap] = useState<{ [key: string]: OptionItem[] }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ option: OptionInterface; items: OptionItem[] }[]>([]);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showCreateOptionPopup, setShowCreateOptionPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [SelectProductType, setSelectProductType] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const statusData = await getStatus()
      setStatus(statusData)
    }
    const fetchCategories = async () => {
      const categoriesData = await getProductTypes();
      setCategories(categoriesData);
    };

    const fetchData = async () => {
      const { options, optionItemsMap } = await getOptions();
      setOptions(options);
      setOptionItemsMap(optionItemsMap);
    };
    fetchStatus();
    fetchData();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      productType_id: SelectProductType,
      description,
      price,
      name: productName,
      options: selectedOptions.map(option => option.option.id),
      user_id: "", // ตั้งค่าเป็นค่า default
      status_id: selectedStatus, // ตั้งค่าเป็นค่า default
      calorie: calorie, // ตั้งค่าเป็นค่า default
    };
    

    try {
      await createProductWithOptions(productData);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectProductType(e.target.value);
  };

  const handleAddButtonClick = () => {
    setShowOptionsPopup(true);
  };

  const handleOptionSelect = (option: OptionInterface) => {
    const items = optionItemsMap[option.id] || [];
    setSelectedOptions([...selectedOptions, { option, items }]);
    setShowOptionsPopup(false);
  };

  const handleCreateOptionClick = () => {
    setShowOptionsPopup(false);
    setShowCreateOptionPopup(true);
  };

  const handleSaveNewOption = async (newOption: OptionInterface) => {
    // บันทึก newOption ลงใน Firestore
    setShowCreateOptionPopup(false);
  };
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value); // อัพเดตค่าที่เลือก
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
          type="number"
          value={calorie}
          onChange={(e) => setCalorie(Number(e.target.value))}
          placeholder="Calorie"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <label htmlFor="status">Select Status:</label>
      <select id="status" value={selectedStatus} onChange={handleStatusChange}>
        <option value="">-- Select Status --</option>
        {status.map((statusItem) => (
          <option key={statusItem.id} value={statusItem.id}>
            {statusItem.name}
          </option>
        ))}
      </select>

        <label htmlFor="category">Select Category:</label>
        <select id="category" value={SelectProductType} onChange={handleCategoryChange}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddButtonClick}>Add Option</button>

        {showOptionsPopup && (
          <div className="popup">
            <h2>Select an Option</h2>
            {options.map((option) => (
              <div key={option.id} onClick={() => handleOptionSelect(option)}>
                {option.name}
              </div>
            ))}
            <button onClick={handleCreateOptionClick}>Create New Option</button>
            <button onClick={() => setShowOptionsPopup(false)}>Close</button>
          </div>
        )}

        {showCreateOptionPopup && (
          <div className="popup">
            <h2>Create New Option</h2>
            
            <button onClick={() => handleSaveNewOption({ id: "", name: "", require: false })}>Save</button>
            <button onClick={() => setShowCreateOptionPopup(false)}>Cancel</button>
          </div>
        )}

        <div className="selected-options">
          <h3>Selected Options:</h3>
          {selectedOptions.map(({ option, items }) => (
            <div key={option.id}>
              <h4>{option.name}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Price Modifier: {item.priceModifier}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
