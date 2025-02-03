"use client";

import Navbar from "@/app/components/Navbar";

import { useParams } from "next/navigation";

import {
  getAllProducts,
  getAllProductTypes,
  getProductsByType,
} from "@/app/services/userProduct";
import { useEffect, useState } from "react";
import FooterUser from "@/app/components/footer/footerUser";
import OptionPopup from "@/app/components/menu/OptionPopup";
import ProductCard from "@/app/components/menu/ProductCard";

export default function ProductType() {
  const params = useParams();
  const typeNameSlug = (params.typeNameSlug as string) || "";
  const [products, setProducts] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >(undefined);

  const togglePopup = (productId: string | undefined) => {
    setSelectedProductId(productId);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      if (typeNameSlug === "coffee") {
        // กรณี typeNameSlug = "coffee" ดึงข้อมูลทั้ง products และ productTypes
        const [productsData, productTypesData] = await Promise.all([
          getAllProducts(),
          getAllProductTypes(),
        ]);

        // Filter และ group ข้อมูลที่มี "coffee" ในชื่อ productType
        const filteredProductTypes = productTypesData.filter((type: any) =>
          type.name.toLowerCase().includes("coffee")
        );

        ;
        setProductTypes(filteredProductTypes);

        // Filter products ที่ตรงกับ productType ที่มี "coffee"
        const filteredProducts = productsData.filter((product: any) =>
          filteredProductTypes.some(
            (type: any) => product.productType_id === type.id
          )
        );

        ;

        setProducts(filteredProducts);
      } else {
        // กรณี typeNameSlug != "coffee" ใช้การดึงข้อมูลแบบเดิม
        const data = await getProductsByType(typeNameSlug.replace(/-/g, " "));
        setProducts(data);
      }

      setLoading(false);
    }

    if (typeNameSlug) {
      fetchProducts();
    }
  }, [typeNameSlug]);

  ;

  return (
    <div className="min-h-screen bg-[#FBF6F0] overflow-y-auto">
      <Navbar />
      
      {/* Popup */}
      {isOpen && (
        <OptionPopup
          onClose={() => togglePopup(undefined)}
          productId={selectedProductId as string}
        />
      )}
  
      {/* เนื้อหาหลัก */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 pt-16 max-w-[90%]">
        {typeNameSlug === "coffee" ? (
          productTypes.map((type) => (
            <div key={type.id}>
              {/* หัวข้อประเภทสินค้า */}
              <div className="py-6 md:py-10 text-center md:text-left">
                <h1 className="font-playfair font-bold text-2xl md:text-3xl text-[#06412B]">
                  {type.name.toUpperCase()}
                </h1>
              </div>
  
              {/* Grid ของสินค้า */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center p-3">
                {products
                  .filter((product) => product.productType_id === type.id)
                  .map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      togglePopup={togglePopup}
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            {/* หัวข้อหมวดหมู่ */}
            <div className="py-6 md:py-10 text-center md:text-left">
              <h1 className="font-playfair font-bold text-2xl md:text-3xl text-[#06412B]">
                {typeNameSlug.toUpperCase().replace(/-/g, " ")}
              </h1>
            </div>
  
            {/* Grid ของสินค้า */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center p-3">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    togglePopup={togglePopup}
                  />
                ))
              ) : (
                <p className="text-center text-gray-600 text-lg md:text-xl">
                  No products found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
  
      <FooterUser color="black" />
    </div>
  );
  
}
