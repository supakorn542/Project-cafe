

import { useEffect, useState } from "react";
import { getProductTypes } from "@/app/services/getproductType";
import { createProductWithOptions } from "@/app/services/addProduct";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { getOptions } from "@/app/services/options";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { statusInterface } from "@/app/interfaces/statusInterface";
import { getStatus } from "@/app/services/getstatus";


import SelectOptionsPopup from "@/app/components/option and optionitem popup/SelectOptionsPopup";

import { GoPlus } from "react-icons/go";
import CreateProductTypePopup from "@/app/components/option and optionitem popup/CreateproductTypepopup";
import { useRefresh } from "@/app/components/RefreshContext/RefreshContext";


const AddProductForm = ({ onClose }: { onClose: () => void }) => {
  const { refresh } = useRefresh();
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
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showCreateOptionPopup, setShowCreateOptionPopup] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [SelectProductType, setSelectProductType] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
const [Fetch ,setFetch] = useState(false)
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const statusData = await getStatus();
      setStatus(statusData);
    };
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
  }, [showOptionsPopup, showPopup, refresh,Fetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    ;
    e.preventDefault();

    // ดึงเฉพาะ option.id จาก selectedOptions
    const optionIds = selectedOptions
      .map((selected) => selected.option.id)
      .filter((id): id is string => id !== undefined);

    const productData = {
      productType_id: SelectProductType,
      description: description,
      price,
      name: productName,
      options: optionIds, // ใช้ array ของ id โดยตรง
      status_id: selectedStatus,
      calorie,
      imageProduct: "",
    };

    try {
      await createProductWithOptions(productData, uploadedImage);
      
      alert("บันถึกข้อมูลสินค้าเสร็จสิ้น");
      window.location.reload();
    } catch (error : any) {
      console.log(error)
      alert("Failed to create product");
    }
  };


  const handleOptionCheckboxChange = (option: OptionInterface) => {
    if (!option.id) {
      ;
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
    setIsPopupOpen(true);
    setShowOptionsPopup(false);
    setShowCreateOptionPopup(true);
  };

 
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 max-h-[90vh]  overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-center text-2xl font-bold">เพิ่มเมนู</h2>

          {/* ชื่อเมนู */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 ">
            <div className="col-span-2">
              <label htmlFor="productName" className="block font-medium">
                ชื่อ
              </label>
              <input
                id="productName"
                className="border border-black rounded-md p-2 w-full"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="grid row-start-2 col-span-2 grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className=" font-medium">
                  ราคา ($)
                </label>
                <input
                  id="price"
                  className="border border-black rounded-md p-2 w-full"
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="">
                <label htmlFor="price" className=" font-medium">
                  แคลโลลี่
                </label>
                <input
                  id="price"
                  className="border border-black rounded-md p-2 w-full"
                  type="number"
                  value={calorie || ""}
                  onChange={(e) => setCalorie(Number(e.target.value))}
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
              id="description"
              className="border border-black rounded-md p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ตัวเลือก */}
          <div className="overflow-y-auto max-h-[60vh]">
            <label className="block font-medium">ตัวเลือก</label>
            {selectedOptions.map(({ option, items }) => (
              <div key={option.id}>
                <h4 className="text-sm font-semibold">{option.name}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item.id} className="text-sm text-gray-400">
                      {item.name} - $ {item.priceModifier}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            <button
              type="button"
              className=" text-black rounded-3xl border-black border px-3 py-1 flex items-center text-center"
              onClick={() => setShowOptionsPopup(true)}
            >
              เพิ่มตัวเลือก <GoPlus />
            </button>

            {showOptionsPopup && (
              <SelectOptionsPopup
                options={options}
                onOptionsUpdate={() => setFetch(true)} 
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
            <label htmlFor="category" className="block font-medium">
              ประเภท
            </label>
            <select
              id="category"
              className="border border-black rounded-md p-2 w-full"
              value={SelectProductType}
              onChange={(e) => setSelectProductType(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div>
              <button onClick={() => setShowPopup(true)}>
                Create Product Type
              </button>
              {showPopup && (
                <CreateProductTypePopup onClose={() => setShowPopup(false)} />
              )}
            </div>

            <label htmlFor="status">สถานะสินค้า</label>
            <select
              className="border border-black rounded-md p-2 w-full"
              id="status"
              value={selectedStatus}
              onChange={handleStatusChange}
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
              onClick={onClose}
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
  );
};
export default AddProductForm;
