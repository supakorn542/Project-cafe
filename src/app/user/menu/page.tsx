"use client";

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { FaCirclePlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import OptionPopup from "../../components/menu/OptionPopup";
import { getAllProducts, getAllProductTypes } from "@/app/services/userProduct";
import { Product } from "@/app/interfaces/product";
import { productTypeInterface } from "@/app/interfaces/productType";

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >(undefined);
  const [productTypes, setProductTypes] = useState<productTypeInterface[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = (productId: string | undefined) => {
    setSelectedProductId(productId);
    setIsOpen((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      // ดึงข้อมูลสินค้าทั้งหมดและประเภทสินค้าพร้อมกัน
      const [fetchedProducts, fetchedProductTypes] = await Promise.all([
        getAllProducts(),
        getAllProductTypes(),
      ]);
      console.log("Fetched Products: ", fetchedProducts);
      console.log("Fetched Product Types: ", fetchedProductTypes);
      setProducts(fetchedProducts);
      setProductTypes(fetchedProductTypes);

      // คำนวณ groupedProducts ทันทีหลังจากข้อมูลถูกโหลด
      const grouped = fetchedProductTypes.map((type) => ({
        type,
        products: fetchedProducts.filter(
          (product) => product.productType_id === type.id
        ),
      }));
      console.log("group inside fetch data", grouped);

      setGroupedProducts(grouped); // อัพเดต groupedProducts
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Products :", products);
  console.log("Product Types :", productTypes);
  console.log("Group Products :", groupedProducts);

  return (
    <>
       <>
      <div className="min-h-screen bg-[#FBF6F0] overflow-y-auto scroll-smooth">
        <Navbar />

        <div className="pt-32">
          {isOpen && (
            <OptionPopup
              onClose={() => togglePopup(undefined)}
              productId={selectedProductId as string}
            />
          )}

          <div className="grid grid-cols-3 ">
            <Image
              src={"/assets/menu/menu-coffee-1.png"}
              alt="Profile"
              width={300}
              height={300}
              className="rounded-tl-[150px] rounded-tr-[150px] rounded-br-[0] rounded-bl-[0]"
            />
            <Image
              src={"/assets/menu/menu-coffee-1.png"}
              alt="Profile"
              width={300}
              height={300}
              className="rounded-tl-[150px] rounded-tr-[150px] rounded-br-[0] rounded-bl-[0]"
            />
            <Image
              src={"/assets/menu/menu-coffee-1.png"}
              alt="Profile"
              width={300}
              height={300}
              className="rounded-tl-[150px] rounded-tr-[150px] rounded-br-[0] rounded-bl-[0]"
            />
          </div>
        </div>

        {/* Grouped Products Section */}
        <div className="px-20 pt-10">
          {groupedProducts.map((group) => (
            <div key={group.type.id} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair font-bold text-3xl text-[#06412B]">
                  {group.type.name.toUpperCase()}
                </h2>
                <button className="py-1 px-2 text-[#06412B] border-2 border-[#06412B] rounded-2xl font-semibold">
                  See More
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 justify-items-center py-10">
                {group.products.map((product: Product, index: number) => (
                  <div
                    key={product.id}
                    className="bg-white p-4 shadow-xl rounded-2xl w-72"
                  >
                    <Image
                      src={product.imageProduct||"/assets/menu/menu-coffee-1.png"}
                      layout="responsive"
                      width={1}
                      height={1}
                      alt="product-image"
                    />
                    <h3 className="text-xl font-serif4 pt-2">{index + 1}</h3>
                    <div className="flex justify-between pb-1">
                      <h2 className="text-xl font-serif4 font-semibold">
                        {product.name}
                      </h2>
                      <h3 className="font-serif4 text-xl font-semibold">
                        ${product.price}
                      </h3>
                    </div>
                    <hr className="border-black" />
                    <div className="flex pt-1">
                      <p className="text-black text-md font-serif4">
                        {product.description}
                      </p>
                      <div className="flex items-end">
                        <FaCirclePlus
                          className="text-xl cursor-pointer"
                          onClick={() => togglePopup(product.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
    </>
  );
};

export default Menu;
