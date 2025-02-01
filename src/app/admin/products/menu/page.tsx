"use client";

import { Product } from "../../../interfaces/product";
import { productTypeInterface } from "../../../interfaces/productType";
import { getProducts, getProductType } from "../../../services/getProduct";
import { deleteProduct } from "../../../services/deleteProduct";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteProductOptionsByProductId } from "@/app/services/deleteProductOption";
import AddProductForm from "../addmenu/page";
import Navbar from "@/app/components/Navbar";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import UpdateProductForm from "../updatemenu/[productId]/page";
import { OptionInterface } from "@/app/interfaces/optioninterface";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import { getProductOptionsByProductId } from "@/app/services/productOption";
import { getOptions } from "@/app/services/options";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import NavbarAdmin from "@/app/components/navbarAdmin/page";
import { RefreshProvider, useRefresh } from "@/app/components/RefreshContext/RefreshContext";

const MenuPage = () => {
  const { refresh } = useRefresh();
  const [products, setProducts] = useState<Product[]>([]);
  const [productType, setProductType] = useState<productTypeInterface[]>([]);
  const [createpopup, setCreatepopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [allGroupedOptions, setallGroupedOptions] = useState<
    {
      productId: string | undefined;
      options: { option: OptionInterface; items: OptionItem[] }[];
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 2; // จำนวนสินค้าต่อหน้า

  // คำนวณ Products ในหน้าปัจจุบัน

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      allGroupedOptions
        .find((selected) => selected.productId === product.id)
        ?.options.some(({ option, items }) => {
          return (
            option.name!.toLowerCase().includes(search) ||
            items.some((item) => item.name.toLowerCase().includes(search))
          );
        })
    );
  });
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const productTypeData = await getProductType();

      // Fetch options and their items
      const { options, optionItemsMap } = await getOptions();

      // Fetch options for each product
      const allGroupedOptions = await Promise.all(
        productsData.map(async (product) => {
          const selectedOptionIds = await getProductOptionsByProductId(
            product.id || ""
          );
          const relatedOptions = options
            .filter((option) => selectedOptionIds.includes(option.id))
            .map((option) => ({
              option,
              items: optionItemsMap[option.id!] || [],
            }));
          return { productId: product.id, options: relatedOptions };
        })
      );

      setallGroupedOptions(allGroupedOptions);
      setProducts(productsData);
      setProductType(productTypeData);
    };

    fetchData();
  }, [refresh]);

  console.log("product list:", filteredProducts);
  const handleDelete = async (id: string, productName: string) => {
    // ลบข้อมูลสินค้า
    await deleteProduct(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    // ลบตัวเลือกสินค้า
    try {
      await deleteProductOptionsByProductId(id);
      console.log("Product options deleted successfully.");
    } catch (error) {
      console.error("Error deleting product options:", error);
    }

    try {
      const publicId = `product_pics/product_pics/${productName}`;
      const response = await axios.delete("/api/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ publicId }),
      });

      if (response) {
        console.log("Image deleted successfully.");
      } else {
        console.error("Error deleting image:");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCloseUpdatePopup = () => {
    setEditPopup(false);
    setSelectedProductId(null);
  };

 

  // const productTypeMap = Object.fromEntries(
  //   productType.map((productType) => [productType.id, productType.name])
  // );

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const handleEditClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  return (
    <RefreshProvider>
    <div className="bg-[#FBF6F0] min-h-screen pt-20">
      <NavbarAdmin />
      {/* Main Container */}
      <div className="container mx-auto border-2 rounded-3xl border-black p-6  bg-background shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Menu</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-full py-2 pl-10 pr-4 w-64"
              value={searchTerm} // Bind search term to input value
              onChange={handleSearchChange} // Call handleSearchChange on input change
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-transparent border border-greenthemewep text-greenthemewep rounded-full  hover:bg-greenthemewep hover:text-white transition duration-150 delay-75 ease-in-out">
              <Link href="/admin/stock/showstock">stock</Link>
            </button>
            <button
              onClick={() => setCreatepopup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-greenthemewep border border-greenthemewep text-white rounded-full  hover:bg-transparent hover:text-greenthemewep transition duration-150 delay-75 ease-in-out"
            >
              <FaPlus />
              <span>Add Menu</span>
            </button>
          </div>
        </div>

        {/* Popup Form */}
        {createpopup && (
          <AddProductForm onClose={() => setCreatepopup(false)} />
        )}

        {/* Product List */}
        <div className="flex flex-col gap-5 max-h-[500px] overflow-auto min-h-[500px]">
          {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-transparent rounded-md overflow-hidden p-6 min-h-[230px] max-h-[230px] h-auto flex flex-col justify-between shadow-md relative"
              >
                {/* Header */}
                <div className="flex justify-between items-center font-semibold text-[20px]">
                  <div>{product.name}</div>
                  <div>$ {product.price}</div>
                </div>

                {/* Content */}
                <div className="flex space-x-4 h-full overflow-hidden">
                  <div className="flex-1 flex items-center">
                    <Image
                      alt="Profile"
                      className="rounded-3xl object-cover"
                      src={product.imageProduct || ""}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[150px] border-l-2 border-black p-2">
                    {allGroupedOptions
                      .find((selected) => selected.productId === product.id)
                      ?.options?.map(({ option, items }) => (
                        <div key={option.id} className="mb-2">
                          <h4 className="text-lg font-semibold">
                            {option.name}
                          </h4>
                          <ul>
                            {items.map((item) => (
                              <li
                                key={item.id}
                                className="text-sm text-gray-600"
                              >
                                {item.name} - $ {" "}
                                {item.priceModifier}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t mt-4 pt-2">
                  <label className="block break-words whitespace-pre-wrap text-sm text-gray-700">
                    คำอธิบาย:{" "}
                    {product.description.length > 60
                      ? `${product.description.slice(0, 60)}...`
                      : product.description}
                  </label>
                </div>

                {/* Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    className="flex items-center justify-center text-black border border-black rounded-full p-2 hover:text-red-800"
                    onClick={() => handleDelete(product.id!, product.name!)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleEditClick(product.id || "")}
                    className="flex items-center justify-center text-black border border-black rounded-full p-2 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                </div>

                {selectedProductId === product.id && (
                  <UpdateProductForm
                    productId={product.id || ""}
                    onClose={handleCloseUpdatePopup}
                  />
                )}
              </div>
            ))}
          
        </div>
      </div>
    </div>
    </RefreshProvider>
  );
};

export default MenuPage;
