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

const EditButton = ({ productId }: { productId: string }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/products/updatemenu/${productId}`);
  };

  return <button onClick={handleEdit}><FaEdit /></button>;
};

const MenuPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productType, setProductType] = useState<productTypeInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsData = await getProducts();
      const productTypeData = await getProductType();
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

  const [createpopup, setCreatepopup] = useState(false);
  const productTypeMap = Object.fromEntries(
    productType.map((productType) => [productType.id, productType.name])
  );

  
  return (
    <div>
      <Navbar />
      {/* Main Container */}
      <div className="container mx-auto border-2 rounded-lg border-black p-6 mt-20 bg-gray-50 shadow-md">
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
        {createpopup && <AddProductForm />}

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-md overflow-hidden"
            >
              <div className="flex items-center space-x-4 p-4">
                {/* Product Details */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Price: {product.price} ฿
                  </p>
                  <p className="text-sm text-gray-600">
                    Calorie: {product.calorie}
                  </p>
                  <p className="text-sm text-gray-600">
                    Product Type:{" "}
                    {productTypeMap[product.productType_id] || "Unknown"}
                  </p>
                </div>
              </div>
              {/* Divider */}
              <hr className="border-t" />
              {/* Action Buttons */}
              <div className="p-4 flex justify-between">
                <button
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(product.id || "")}
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  
                  <EditButton productId={product.id || ""} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
