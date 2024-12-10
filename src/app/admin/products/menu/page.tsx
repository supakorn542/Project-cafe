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



const MenuPage = () => {
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
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    try {
      await deleteProductOptionsByProductId(id);
      console.log("Product options deleted successfully.");
    } catch (error) {
      console.error("Error deleting product options:", error);
    }
  };

  const handleCloseUpdatePopup= () => {
    setEditPopup(false)
  }

  // const productTypeMap = Object.fromEntries(
  //   productType.map((productType) => [productType.id, productType.name])
  // );

  return (
    <div>
      <Navbar />
      {/* Main Container */}
      <div className="container mx-auto border-2 rounded-3xl border-black p-6 mt-20 bg-background shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Menu</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-full py-2 pl-10 pr-4 w-64"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200">
              Stock
            </button>
            <button
              onClick={() => setCreatepopup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            >
              <FaPlus />
              <span>Add Menu</span>
            </button>
          </div>
        </div>

        {/* Popup Form */}
        {createpopup && <AddProductForm onClose={() => setCreatepopup(false)} />}

        {/* Product List */}
        <div className="flex flex-col ">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-md overflow-hidden p-6"
            >
              <div className="flex justify-between font-semibold text-[20px]">
                <div>{product.name}</div>
                <div>$ {product.price}</div>
              </div>
              <div className="flex ">
                <div className="flex-1 flex">
                  <img className="w-[100px] h-[100px] rounded-3xl" src=""></img>
                  <div>
                    {allGroupedOptions
                      .find((selected) => selected.productId === product.id)
                      ?.options?.map(({ option, items }) => (
                        <div key={option.id}>
                          <h4 className="text-xl font-semibold">
                            {option.name}
                          </h4>
                          <ul>
                            {items.map((item) => (
                              <li key={item.id}>
                                {item.name} - Price Modifier:{" "}
                                {item.pricemodifier}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex-1 relative border-l-2 border-black pl-4">
                  <label className="block break-words whitespace-pre-wrap">
                    คำอธิบาย:{" "}
                    {product.description.length > 40
                      ? `${product.description.slice(
                          0,
                          40
                        )}\n${product.description.slice(100)}`
                      : product.description}
                  </label>
                  <div className="flex justify-between w-20 absolute bottom-0 right-0">
                    <button
                      className="flex items-center space-x-2 text-black border border-black rounded-full p-2 hover:text-red-800"
                      onClick={() => handleDelete(product.id || "")}
                    >
                      <FaTrash />
                    </button>
                    <button onClick={() => setEditPopup(true)} className="flex items-center space-x-2 text-black border border-black rounded-full p-2 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    {editPopup && <UpdateProductForm productId={product.id || ""} onClose={handleCloseUpdatePopup} /> }
                  </div>
                </div>
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
                  strokeWidth="2"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
