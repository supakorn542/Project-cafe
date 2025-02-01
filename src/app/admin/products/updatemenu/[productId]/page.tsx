"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductTypes } from "../../../../services/getproductType";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { getOptions } from "@/app/services/options";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { statusInterface } from "@/app/interfaces/statusInterface";
import { getStatus } from "@/app/services/getstatus";
import { getProductById } from "@/app/services/getProduct";
import { updateProduct } from "@/app/services/updateProduct";
import {
  addProductOption,
  getProductOptionsByProductId,
} from "@/app/services/productOption";
import { deleteArrayOptionByProductId } from "@/app/services/deleteProductOption";
import OptionupdatePopup from "@/app/components/option and optionitem popup/optionupdatepopup";
import CreateProductTypePopup from "@/app/components/option and optionitem popup/CreateproductTypepopup";
import SelectOptionsPopup from "@/app/components/option and optionitem popup/SelectOptionsPopup";
import {
  RefreshProvider,
  useRefresh,
} from "@/app/components/RefreshContext/RefreshContext";

const UpdateProductForm = ({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) => {
  
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
  const [selectedOptions, setSelectedOptions] = useState<
    {
      option: OptionInterface;
      items: OptionItem[];
    }[]
  >([]);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [Fetch ,setFetch] = useState(false)
  const [selectProductType, setSelectProductType] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const fetchData = useCallback(async () => {
    if (!productId) return;

    try {
      const productData = await getProductById(productId);
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
        .map((option) => ({ option, items: optionItemsMap[option.id!] || [] }));

      setSelectedOptions(selectedOptionsData);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }

    try {
      const statusData = await getStatus();
      const categoriesData = await getProductTypes();
      setStatus(statusData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories or status:", error);
    }

    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [Fetch]);


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
          selectedOptions,
          uploadedImage
        );

        if (isUpdated) {
          alert("Product updated successfully");
          window.location.reload();
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

  const handleCreateOptionClick = () => {
    setShowOptionsPopup(false);
  };
  const handleOptionCreated = () => {
    setFetch(!Fetch);  // Trigger fetch data ใหม่
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

  return (
    <RefreshProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-center text-2xl font-bold">แก้ไขเมนู</h2>

            {/* ชื่อเมนู */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="productName" className="block font-medium">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={productName}
                  className="border border-black rounded-md p-2 w-full"
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="grid row-start-2 col-span-2 grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="font-medium">
                    ราคา ($)
                  </label>
                  <input
                    type="number"
                    value={price || ""}
                    className="border border-black rounded-md p-2 w-full"
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Price"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="calorie" className="font-medium">
                    แคลลอรี่
                  </label>
                  <input
                    type="number"
                    value={calorie || ""}
                    className="border border-black rounded-md p-2 w-full"
                    onChange={(e) => setCalorie(Number(e.target.value))}
                    placeholder="Calorie"
                    required
                  />
                </div>
              </div>
            </div>

            {/* คำอธิบาย */}
            <div>
              <label htmlFor="description" className="block font-medium">
                คำอธิบายเมนู
              </label>
              <textarea
                value={description}
                className="border border-black rounded-md p-2 w-full"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
              />
            </div>

            {/* ตัวเลือก */}
            <div>
              <div className="selected-options">
                <h3>ตัวเลือก</h3>
                {selectedOptions.map(({ option, items }) => (
                  <div key={option.id} className="text-sm font-semibold">
                    <h4>{option.name}</h4>
                    <ul>
                      {items.map((item) => (
                        <li key={item.id} className="text-sm text-gray-500">
                          {item.name} - $ {item.priceModifier}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <svg
                className="w-full my-4"
                height="1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="#000000"
                  strokeWidth="1"
                />
              </svg>
              <button type="button" onClick={() => setShowOptionsPopup(true)}>
                Edit Option
              </button>
              {showOptionsPopup && (
                <SelectOptionsPopup
                onOptionsUpdate={handleOptionCreated} 
                  options={options}
                  selectedOptions={selectedOptions}
                  optionItemsMap={optionItemsMap}
                  onOptionChange={handleOptionCheckboxChange}
                  onCreateOption={handleCreateOptionClick}
                  onClose={() => setShowOptionsPopup(false)}
                />
              )}
            </div>

            {/* หมวดหมู่ */}
            <div>
              <label htmlFor="category">Select Category:</label>
              <select
                id="category"
                value={selectProductType}
                className="border border-black rounded-md p-2 w-full"
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div>
                <button type="button" onClick={() => setShowPopup(true)}>
                  Create Product Type
                </button>
                {showPopup && (
                  <CreateProductTypePopup onClose={() => setShowPopup(false)} />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="status">สถานะสินค้า</label>
              <select
                id="status"
                value={selectedStatus}
                className="border border-black rounded-md p-2 w-full"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">-- Select Status --</option>
                {status.map((statusItem) => (
                  <option key={statusItem.id} value={statusItem.id}>
                    {statusItem.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="  cursor-pointer bg-white text-black rounded-3xl px-4 py-1 text-xl hover:bg-[#c7c4c4] transition duration-300 font-serif4">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setUploadedImage(e.target.files?.[0] ?? null)}
              />
            </label>

            {/* ปุ่ม */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="text-black border border-black rounded-md px-4 py-2 hover:bg-black hover:text-white"
                onClick={() => onClose()}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="bg-black text-white border border-black rounded-md px-4 py-2 hover:bg-white hover:text-black"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </RefreshProvider>
  );
};
export default UpdateProductForm;
