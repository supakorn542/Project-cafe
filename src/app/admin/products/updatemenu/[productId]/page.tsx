"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductTypes } from "../../../../services/getproductType";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { getOptions } from "@/app/services/options";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { statusInterface } from "@/app/interfaces/statusInterface";
import { getStatus } from "@/app/services/getstatus";
import { fetchProduct } from "@/app/services/getProduct";
import { updateProduct } from "@/app/services/updateProduct";

const UpdateProductForm = () => {
  const { productId } = useParams();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<statusInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState<OptionInterface[]>([]);
  const [optionItemsMap, setOptionItemsMap] = useState<{
    [key: string]: OptionItem[];
  }>({});
  const [selectedOptions, setSelectedOptions] = useState<
    { option: OptionInterface; items: OptionItem[] }[]
  >([]);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectProductType, setSelectProductType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (typeof productId === "string") {
        try {
          const productData = await fetchProduct(productId);
          setProductName(productData.name);
          setPrice(productData.price);
          setCalorie(productData.calorie);
          setDescription(productData.description);
          setSelectedStatus(productData.status_id.id); // เปลี่ยนให้ใช้ `id` ของ status
          setSelectProductType(productData.productType_id.id); // เปลี่ยนให้ใช้ `id` ของ productType
          const selectedOptionsFromProduct = productData.options.map((optionId: string) => {
            const option = options.find((opt) => opt.id === optionId);
            const items = optionItemsMap[optionId] || [];
            return { option, items };
          });
          setSelectedOptions(selectedOptionsFromProduct);
          console.log(selectedOptionsFromProduct)
          console.log("status: ", productData.status_id)
          console.log("productType: ", productData.productType_id)
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }

      // ดึงข้อมูล status, categories, และ options
      const statusData = await getStatus();
      const categoriesData = await getProductTypes();
      const { options, optionItemsMap } = await getOptions();

      setStatus(statusData);
      setCategories(categoriesData);
      setOptions(options);
      setOptionItemsMap(optionItemsMap);
    };
    fetchData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof productId == "string") {
      try {
        const isUpdated = await updateProduct(
          productId, // productId ที่ได้จาก useParams
          productName,
          description,
          price,
          calorie,
          selectProductType,
          selectedStatus,
          selectedOptions
        );

        if (isUpdated) {
          alert("Product updated successfully!");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
      }
    }
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectProductType(e.target.value);
  };

  const handleOptionCheckboxChange = (option: OptionInterface) => {
    const items = optionItemsMap[option.id] || [];
    const optionIndex = selectedOptions.findIndex(
      (selected) => selected.option.id === option.id
    );

    if (optionIndex > -1) {
      // หากตัวเลือกถูกเลือกแล้ว จะลบออกจาก selectedOptions
      setSelectedOptions(
        selectedOptions.filter((selected) => selected.option.id !== option.id)
      );
    } else {
      // หากตัวเลือกยังไม่ถูกเลือก จะเพิ่มลงใน selectedOptions
      setSelectedOptions([...selectedOptions, { option, items }]);
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
        <select
          id="status"
          value={selectedStatus} // ค่าเริ่มต้นจาก selectedStatus
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">-- Select Status --</option>
          {status.map((statusItem) => (
            <option key={statusItem.id} value={statusItem.id}>
              {statusItem.name}
            </option>
          ))}
        </select>

        <label htmlFor="category">Select Category:</label>
        <select
          id="category"
          value={selectProductType} // ค่าเริ่มต้นจาก selectProductType
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        
        <button type="button" onClick={() => setShowOptionsPopup(true)}>edit Option</button>

        {showOptionsPopup && (
          <div className="popup">
            <h2>Select Options</h2>
            {options.map((option) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  checked={selectedOptions.some(selected => selected.option.id === option.id)}
                  onChange={() => handleOptionCheckboxChange(option)}
                />
                <label>{option.name}</label>
              </div>
            ))}
            {/* <button onClick={handleCreateOptionClick}>Create New Option</button> */}
            <button onClick={() => setShowOptionsPopup(false)}>Close</button>
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
