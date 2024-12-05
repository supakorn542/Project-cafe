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
import { addProductOption, getProductOptionsByProductId } from "@/app/services/productOption";
import { deleteArrayOptionByProductId } from "@/app/services/deleteProductOption";
import OptionupdatePopup from "@/app/components/option and optionitem popup/optionupdatepopup";

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
  const [optionsToAdd, setOptionsToAdd] = useState<string[]>([]);
  const [optionsToRemove, setOptionsToRemove] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    option: OptionInterface;
    items: OptionItem[];
  }[]>([]);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectProductType, setSelectProductType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof productId === "string") {
        try {
          const productData = await fetchProduct(productId);
          const selectedOptionIds = await getProductOptionsByProductId(productId);
          const { options, optionItemsMap } = await getOptions();

          setOptions(options);
          setOptionItemsMap(optionItemsMap);
          setProductName(productData.name);
          setPrice(productData.price);
          setCalorie(productData.calorie);
          setDescription(productData.description);
          setSelectedStatus(productData.status_id.id);
          setSelectProductType(productData.productType_id.id);

          const selectedOptionsData = options
            .filter((option) => selectedOptionIds.includes(option.id))
            .map((option) => ({
              option,
              items: optionItemsMap[option.id!] || [],
            }));

          setSelectedOptions(selectedOptionsData);
          console.log("option :", selectedOptionsData);
          console.log("optionIds :", selectedOptionIds);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      }

      const statusData = await getStatus();
      const categoriesData = await getProductTypes();
      setStatus(statusData);
      setCategories(categoriesData);
      setLoading(false);
    };

    fetchData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    try {
      for (const optionId of optionsToAdd) {
        await addProductOption(productId as string, optionId);
      }

      // Remove options
      for (const optionId of optionsToRemove) {
        await deleteArrayOptionByProductId(productId as string, optionId);
      }

      if (typeof productId == "string") {
        const isUpdated = await updateProduct(
          productId,
          productName,
          description,
          price,
          calorie,
          selectProductType,
          selectedStatus,
          selectedOptions
        );

        if (isUpdated) {
          alert("Product updated successfully");
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectProductType(e.target.value);
  };

  // handleOptionCheckboxChange
  const handleOptionCheckboxChange = (option: OptionInterface) => {
    if (!option.id) return; // ข้ามถ้า id ไม่มีค่า
  
    const items = optionItemsMap[option.id] || [];
    const optionIndex = selectedOptions.findIndex(
      (selected) => selected.option.id === option.id
    );
  
    if (optionIndex > -1) {
      setSelectedOptions(
        selectedOptions.filter((selected) => selected.option.id !== option.id)
      );
      setOptionsToRemove([...optionsToRemove, option.id]);
    } else {
      setSelectedOptions([...selectedOptions, { option, items }]);
      setOptionsToAdd([...optionsToAdd, option.id]);
    }
  };
  
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Input fields */}
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

        {/* Dropdowns for Status and Category */}
        <label htmlFor="status">Select Status:</label>
        <select
          id="status"
          value={selectedStatus}
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
          value={selectProductType}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Option popup */}
        <button type="button" onClick={() => setShowOptionsPopup(true)}>
          Edit Option
        </button>
        {showOptionsPopup && (
          <OptionupdatePopup
            options={options}
            selectedOptions={selectedOptions}
            onClose={() => setShowOptionsPopup(false)}
            onToggleOption={handleOptionCheckboxChange}
          />
        )}

        {/* Selected options display */}
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
