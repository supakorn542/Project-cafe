"use client";

import { useEffect, useState } from "react";
import { getProductTypes } from "../../../services/getproductType";
import { createProductWithOptions } from "../../../services/addProduct";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { getOptions } from "@/app/services/options";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { statusInterface } from "@/app/interfaces/statusInterface";
import { getStatus } from "@/app/services/getstatus";
import Popupcreate from "../../../components/option and optionitem popup/popupcreateoption";
import SelectOptionsPopup from "@/app/components/option and optionitem popup/SelectOptionsPopup";

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<statusInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState<OptionInterface[]>([]);
  const [optionItemsMap, setOptionItemsMap] = useState<{ [key: string]: OptionItem[] }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ option: OptionInterface; items: OptionItem[] }[]>([]);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showCreateOptionPopup, setShowCreateOptionPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [SelectProductType, setSelectProductType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

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
  
    // ดึงเฉพาะ option.id จาก selectedOptions
    const optionIds = selectedOptions
    .map((selected) => selected.option.id)
    .filter((id): id is string => id !== undefined);

  
    const productData = {
      productType_id: SelectProductType,
      description,
      price,
      name: productName,
      options: optionIds, // ใช้ array ของ id โดยตรง
      user_id: "",
      status_id: selectedStatus,
      calorie,
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

  const handleOptionCheckboxChange = (option: OptionInterface) => {
    if (!option.id) {
      console.error("Option ID is undefined");
      return; // หยุดทำงานถ้า id เป็น undefined
    }
  
    const items = optionItemsMap[option.id] || []; // ปลอดภัยเพราะตรวจสอบแล้ว
    const optionIndex = selectedOptions.findIndex(
      (selected) => selected.option.id === option.id
    );
  
    if (optionIndex > -1) {
      setSelectedOptions((prev) =>
        prev.filter((selected) => selected.option.id !== option.id)
      );
    } else {
      setSelectedOptions((prev) => [...prev, { option, items }]);
    }
  };
  

  const handleCreateOptionClick = () => {
    setIsPopupOpen(true)
    setShowOptionsPopup(false);
    setShowCreateOptionPopup(true);
  };

  const handleSaveNewOption = async (newOption: OptionInterface) => {
    setShowCreateOptionPopup(false);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    {/* Popup Container */}
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
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

        <button type="button" onClick={() => setShowOptionsPopup(true)}>Add Option</button>

      
         {showOptionsPopup && (
          <SelectOptionsPopup
            options={options}
            selectedOptions={selectedOptions}
            optionItemsMap={optionItemsMap}
            onOptionChange={handleOptionCheckboxChange}
            onCreateOption={handleCreateOptionClick}
            onClose={() => setShowOptionsPopup(false)}
          />
        )}

        <div className="selected-options">
          <h3>Selected Options:</h3>
          {selectedOptions.map(({ option, items }) => (
            <div key={option.id}>
              <h4>{option.name}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Price Modifier: {item.pricemodifier}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button type="submit">Create Product</button>
      </form>
      </div>
    </div>
  );
};

export default AddProductForm;
