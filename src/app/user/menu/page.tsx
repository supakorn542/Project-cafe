"use client";

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { FaCirclePlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import OptionPopup from "@/app/components/menu/OptionPopup";
import { getAllProducts, getAllProductTypes } from "@/app/services/userProduct";
import { Product } from "@/app/interfaces/product";
import { productTypeInterface } from "@/app/interfaces/productType";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import FooterUser from "@/app/components/footer/footerUser";
import Link from "next/link";

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >(undefined);
  const [productTypes, setProductTypes] = useState<productTypeInterface[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<{ [key: string]: number }>(
    {}
  );

  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  const togglePopup = (productId: string | undefined) => {
    setSelectedProductId(productId);
    setIsOpen((prev) => !prev);
  };

  const handleNextSlide = (typeId: string) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [typeId]: (prev[typeId] || 0) + 1,
    }));
  };

  const handlePrevSlide = (typeId: string) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [typeId]: Math.max((prev[typeId] || 0) - 1, 0),
    }));
  };

  const fetchData = async () => {
    try {
      // ดึงข้อมูลสินค้าทั้งหมดและประเภทสินค้าพร้อมกัน
      const [fetchedProducts, fetchedProductTypes] = await Promise.all([
        getAllProducts(),
        getAllProductTypes(),
      ]);
      ;
      ;
      setProducts(fetchedProducts);
      setProductTypes(fetchedProductTypes);

      const coffeeTypeIds = fetchedProductTypes
        .filter((type) => type.name.toLowerCase().includes("coffee"))
        .map((type) => type.id);

      // กรองสินค้าที่ไม่ใช่ประเภท "coffee"
      const grouped = fetchedProductTypes
        .filter((type) => !type.name.toLowerCase().includes("coffee")) // กรองประเภทที่ไม่ใช่ coffee
        .map((type) => ({
          type,
          products: fetchedProducts.filter(
            (product) => product.productType_id === type.id
          ),
        }));

      // รวมสินค้าจากประเภท "coffee" ที่ประกอบด้วยหลายประเภทไว้ในกลุ่มเดียว
      grouped.unshift({
        type: { id: "coffee", name: "coffee" }, // สร้างประเภทใหม่สำหรับ coffee
        products: fetchedProducts.filter((product) =>
          coffeeTypeIds.includes(product.productType_id)
        ),
      });
      ;

      setGroupedProducts(grouped); // อัพเดต groupedProducts
      ;
    } catch (error) {
      ;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1); // หน้าจอเล็กสุด แสดงทีละ 1 ชิ้น
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // หน้าจอกลาง แสดงทีละ 2 ชิ้น
      } else {
        setItemsPerSlide(3); // หน้าจอใหญ่ แสดงทีละ 3 ชิ้น
      }
    };

    updateItemsPerSlide(); // เรียกใช้ครั้งแรกตอนโหลด
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  ;
  ;
  ;

  return (
    <>
      <div className="min-h-screen bg-[#FBF6F0] overflow-y-auto scroll-smooth">
        <Navbar />

        <div className="pt-16 lg:pt-32">
          {isOpen && (
            <OptionPopup
              onClose={() => togglePopup(undefined)}
              productId={selectedProductId as string}
            />
          )}
        </div>
        <div className="hidden xl:grid grid-cols-3 gap-6 place-items-center px-4 px-10 py-16">
          <div className="relative w-full max-w-[350px] h-[400px] overflow-visible ">
            <Image
              src="/assets/menu/menu-semi-circle-1.jpg"
              alt="Menu"
              width={350}
              height={400}
              className="object-cover w-full h-full rounded-t-full shadow-md shadow-black/30"
            />
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[220px] overflow-visible z-10"
              viewBox="0 0 380 220"
            >
              <defs>
                <path
                  id="textPathOuter"
                  d="M0,500 L0,200 A170,170 0 0,1 380,160 L380,500"
                  fill="transparent"
                />
              </defs>

              <text fontSize="20" fontFamily="Playfair Display" fill="#06412B">
                <textPath
                  href="#textPathOuter"
                  startOffset="50%"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  JUST BREWED HAPPINESS IN A CUP JUST BREWED HAPPINESS IN A CUP
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>
            </svg>
            <div className="flex  items-center justify-center ">
              <hr className="w-36 border-t-2 border-[#06412B] " />
              <svg
                className=" w-20  "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <path
                  fill="#06412B"
                  d="M52.51,51.21c4.38-.06,8.76-.14,13.13-.31,5.22-.2,10.43-.47,15.64-1v-.25c-5.22-.42-10.43-.63-15.65-.77-4.24-.12-8.47-.15-12.71-.15q3.22-3.26,6.36-6.59c2.78-3,5.5-6,8.09-9.19l-.18-.17C64,35.4,61,38.13,58,40.91c-2.27,2.12-4.51,4.3-6.72,6.49l0-6.28c-.07-3-.1-5.92-.21-8.88-.18-5.91-.47-11.83-1-17.75h-.25c-.55,5.92-.84,11.84-1,17.75-.11,3-.14,5.92-.21,8.88l0,6.07Q45.29,44,42,40.91c-3-2.78-6-5.51-9.19-8.09l-.18.17c2.59,3.18,5.31,6.21,8.09,9.19,2.1,2.24,4.23,4.43,6.38,6.61l-4.93.06c-2.6.08-5.21.11-7.81.23-5.22.19-10.43.47-15.64,1v.25c5.22.45,10.43.66,15.65.8,2.6.08,5.21.09,7.82.14h5.26c-2.25,2.3-4.5,4.62-6.69,7-2.78,3-5.51,6-8.13,9.15l.18.18C36,64.94,39,62.2,42,59.42q3.33-3.09,6.56-6.28c0,4.87.1,9.74.27,14.62.19,5.91.46,11.83,1,17.75H50c.52-5.92.79-11.84,1-17.75.17-4.94.23-9.89.27-14.83,2.23,2.19,4.48,4.37,6.77,6.49,3,2.78,6,5.52,9.15,8.13l.18-.18c-2.62-3.14-5.35-6.17-8.13-9.15C57,55.84,54.78,53.52,52.51,51.21Z"
                />
              </svg>
              <hr className="w-36 border-t-2 border-[#06412B]" />
            </div>
          </div>
          <div className="relative w-full max-w-[350px] h-[400px] overflow-visible ">
            <Image
              src={"/assets/menu/menu-semi-circle-2.jpg"}
              alt="Menu"
              width={350}
              height={400}
              className="object-cover rounded-t-full w-full h-full shadow-md shadow-black/30"
            />
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[220px] overflow-visible z-10 "
              viewBox="0 0 380 220"
            >
              <defs>
                <path
                  id="textPathOuter2"
                  d="M0,500 L0,200 A170,170 0 0,1 380,160 L380,500"
                  fill="transparent"
                />
              </defs>

              <text fontSize="20" fontFamily="Playfair Display" fill="#06412B">
                <textPath
                  href="#textPathOuter2"
                  startOffset="50%"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  JUST BREWED HAPPINESS IN A CUP JUST BREWED HAPPINESS IN A CUP
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>
            </svg>
            <div className="flex  items-center justify-between gap-x-1 ">
              <svg
                className="w-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                overflow="visible"
              >
                <line
                  x1="60"
                  y1="50"
                  x2="120"
                  y2="50"
                  stroke="#06412B"
                  strokeWidth="2"
                />

                <path
                  fill="#06412B"
                  d="M52.51,51.21c4.38-.06,8.76-.14,13.13-.31,5.22-.2,10.43-.47,15.64-1v-.25c-5.22-.42-10.43-.63-15.65-.77-4.24-.12-8.47-.15-12.71-.15q3.22-3.26,6.36-6.59c2.78-3,5.5-6,8.09-9.19l-.18-.17C64,35.4,61,38.13,58,40.91c-2.27,2.12-4.51,4.3-6.72,6.49l0-6.28c-.07-3-.1-5.92-.21-8.88-.18-5.91-.47-11.83-1-17.75h-.25c-.55,5.92-.84,11.84-1,17.75-.11,3-.14,5.92-.21,8.88l0,6.07Q45.29,44,42,40.91c-3-2.78-6-5.51-9.19-8.09l-.18.17c2.59,3.18,5.31,6.21,8.09,9.19,2.1,2.24,4.23,4.43,6.38,6.61l-4.93.06c-2.6.08-5.21.11-7.81.23-5.22.19-10.43.47-15.64,1v.25c5.22.45,10.43.66,15.65.8,2.6.08,5.21.09,7.82.14h5.26c-2.25,2.3-4.5,4.62-6.69,7-2.78,3-5.51,6-8.13,9.15l.18.18C36,64.94,39,62.2,42,59.42q3.33-3.09,6.56-6.28c0,4.87.1,9.74.27,14.62.19,5.91.46,11.83,1,17.75H50c.52-5.92.79-11.84,1-17.75.17-4.94.23-9.89.27-14.83,2.23,2.19,4.48,4.37,6.77,6.49,3,2.78,6,5.52,9.15,8.13l.18-.18c-2.62-3.14-5.35-6.17-8.13-9.15C57,55.84,54.78,53.52,52.51,51.21Z"
                />
              </svg>

              <h2 className="text-lg font-playfair text-center font-bold text-[#06412B]">
                Flavors of the Day
              </h2>

              <svg
                className="w-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                overflow="visible"
              >
                <line
                  x1="-20"
                  y1="50"
                  x2="50"
                  y2="50"
                  stroke="#06412B"
                  strokeWidth="2"
                />

                <path
                  fill="#06412B"
                  d="M52.51,51.21c4.38-.06,8.76-.14,13.13-.31,5.22-.2,10.43-.47,15.64-1v-.25c-5.22-.42-10.43-.63-15.65-.77-4.24-.12-8.47-.15-12.71-.15q3.22-3.26,6.36-6.59c2.78-3,5.5-6,8.09-9.19l-.18-.17C64,35.4,61,38.13,58,40.91c-2.27,2.12-4.51,4.3-6.72,6.49l0-6.28c-.07-3-.1-5.92-.21-8.88-.18-5.91-.47-11.83-1-17.75h-.25c-.55,5.92-.84,11.84-1,17.75-.11,3-.14,5.92-.21,8.88l0,6.07Q45.29,44,42,40.91c-3-2.78-6-5.51-9.19-8.09l-.18.17c2.59,3.18,5.31,6.21,8.09,9.19,2.1,2.24,4.23,4.43,6.38,6.61l-4.93.06c-2.6.08-5.21.11-7.81.23-5.22.19-10.43.47-15.64,1v.25c5.22.45,10.43.66,15.65.8,2.6.08,5.21.09,7.82.14h5.26c-2.25,2.3-4.5,4.62-6.69,7-2.78,3-5.51,6-8.13,9.15l.18.18C36,64.94,39,62.2,42,59.42q3.33-3.09,6.56-6.28c0,4.87.1,9.74.27,14.62.19,5.91.46,11.83,1,17.75H50c.52-5.92.79-11.84,1-17.75.17-4.94.23-9.89.27-14.83,2.23,2.19,4.48,4.37,6.77,6.49,3,2.78,6,5.52,9.15,8.13l.18-.18c-2.62-3.14-5.35-6.17-8.13-9.15C57,55.84,54.78,53.52,52.51,51.21Z"
                />
              </svg>
            </div>
          </div>
          <div className="relative w-full max-w-[350px] h-[400px] overflow-visible ">
            <Image
              src={"/assets/menu/menu-semi-circle-3.jpg"}
              alt="Menu"
              width={350}
              height={400}
              className="object-cover rounded-t-full w-full h-full shadow-md shadow-black/30"
            />
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[220px] overflow-visible z-10"
              viewBox="0 0 380 220"
            >
              <defs>
                <path
                  id="textPathOuter3"
                  d="M0,500 L0,200 A170,170 0 0,1 380,160 L380,500"
                  fill="transparent"
                />
              </defs>

              <text fontSize="20" fontFamily="Playfair Display" fill="#06412B">
                <textPath
                  href="#textPathOuter3"
                  startOffset="50%"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  JUST BREWED HAPPINESS IN A CUP JUST BREWED HAPPINESS IN A CUP
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>
            </svg>
            <div className="flex  items-center justify-center ">
              <hr className="w-36 border-t-2 border-[#06412B] " />
              <svg
                className=" w-20  font-bold"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <path
                  fill="#06412B"
                  d="M52.51,51.21c4.38-.06,8.76-.14,13.13-.31,5.22-.2,10.43-.47,15.64-1v-.25c-5.22-.42-10.43-.63-15.65-.77-4.24-.12-8.47-.15-12.71-.15q3.22-3.26,6.36-6.59c2.78-3,5.5-6,8.09-9.19l-.18-.17C64,35.4,61,38.13,58,40.91c-2.27,2.12-4.51,4.3-6.72,6.49l0-6.28c-.07-3-.1-5.92-.21-8.88-.18-5.91-.47-11.83-1-17.75h-.25c-.55,5.92-.84,11.84-1,17.75-.11,3-.14,5.92-.21,8.88l0,6.07Q45.29,44,42,40.91c-3-2.78-6-5.51-9.19-8.09l-.18.17c2.59,3.18,5.31,6.21,8.09,9.19,2.1,2.24,4.23,4.43,6.38,6.61l-4.93.06c-2.6.08-5.21.11-7.81.23-5.22.19-10.43.47-15.64,1v.25c5.22.45,10.43.66,15.65.8,2.6.08,5.21.09,7.82.14h5.26c-2.25,2.3-4.5,4.62-6.69,7-2.78,3-5.51,6-8.13,9.15l.18.18C36,64.94,39,62.2,42,59.42q3.33-3.09,6.56-6.28c0,4.87.1,9.74.27,14.62.19,5.91.46,11.83,1,17.75H50c.52-5.92.79-11.84,1-17.75.17-4.94.23-9.89.27-14.83,2.23,2.19,4.48,4.37,6.77,6.49,3,2.78,6,5.52,9.15,8.13l.18-.18c-2.62-3.14-5.35-6.17-8.13-9.15C57,55.84,54.78,53.52,52.51,51.21Z"
                />
              </svg>
              <hr className="w-36 border-t-2 border-[#06412B]" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex  justify-between py-24">
          <div className="relative w-[500px] h-[300px] overflow-visible">
            <Image
              src={"/assets/menu/menu-component1-bg.jpg"}
              width={500}
              height={300}
              className="object-cover w-full h-full rounded-r-full"
              loading="lazy"
              alt="bg"
            />
            <svg
              className="absolute top-[-20px] left-[-20px] w-[530px] h-[340px] overflow-visible z-10"
              viewBox="0 0 540 340"
            >
              <defs>
                {/* เส้นตรงซ้าย */}
                <path id="lineLeft" d="M30,10 L400,10" fill="transparent" />
                {/* โค้งครึ่งวงกลมขวา */}
                <path
                  id="curveRight"
                  d="M25,10 L380,10 A140,140 0 0,1 370,330 L25,340"
                  fill="transparent"
                />
                {/* เส้นตรงขวา */}
                <path id="lineRight" d="M30,342 L400,342" fill="transparent" />
              </defs>

              <text
                fontSize="18"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath href="#lineLeft" startOffset="0%" textAnchor="start">
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>

              <text
                fontSize="18"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath
                  href="#curveRight"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  JUST BREWED HAPPINESS IN A CUP JUST BREWED HAPPINESS
                </textPath>
              </text>

              <text
                fontSize="18"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath href="#lineRight" startOffset="0%" textAnchor="start">
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>
            </svg>
          </div>

          <div className="relative w-[500px] h-[300px] overflow-visible">
            <Image
              src={"/assets/menu/menu-component2-bg.jpg"}
              width={500}
              height={300}
              className="object-cover w-full h-full rounded-l-full"
              loading="lazy"
              alt="bg"
            />
            <svg
              className="absolute top-[-20px] left-[-20px]  w-[520px] h-[340px] overflow-visible z-10"
              viewBox="0 0 540 340"
            >
              <defs>
                {/* เส้นตรงขวา */}
                <path id="lineRight2" d="M515,-5 L190,-5" fill="transparent" />

                {/* เส้นโค้งครึ่งวงกลมซ้าย */}
                <path
                  id="curveLeft2"
                  d="M510,-5 L175,-5 A140,140 0 0,0 175,345 L510,332"
                  fill="transparent"
                />

                {/* เส้นตรงซ้าย */}
                <path id="lineLeft2" d="M535,332 L140,332" fill="transparent" />
              </defs>

              <text
                fontSize="20"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath
                  href="#lineRight2"
                  startOffset="100%"
                  textAnchor="end"
                >
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>

              <text
                fontSize="20"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath
                  href="#curveLeft2"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  JUST BREWED HAPPINESS IN A CUP BREWED HAPPINESS
                </textPath>
              </text>

              <text
                fontSize="20"
                fontFamily="Playfair Display"
                fill="#06412B"
                fontWeight="600"
              >
                <textPath href="#lineLeft2" startOffset="0%" textAnchor="start">
                  JUST BREWED HAPPINESS IN A CUP
                </textPath>
              </text>
            </svg>
          </div>
        </div>
        <div className="py-10 px-6 md:px-12 lg:px-36 font-playfair font-bold text-[#06412B]">
          <div className="flex flex-wrap justify-center lg:justify-between gap-6 text-xl md:text-2xl lg:text-3xl">
            <Link href="#coffee">
              <div className="cursor-pointer">COFFEE</div>
            </Link>
            <Link href="#soft-drink">
              <div className="cursor-pointer">SOFT DRINK</div>
            </Link>
            <Link href="#signature-drink">
              <div className="cursor-pointer">SIGNATURE DRINK</div>
            </Link>
            <Link href="#matcha">
              <div className="cursor-pointer">MATCHA</div>
            </Link>
          </div>
        </div>

        <div className="px-10 lg:px-20 pt-5 lg:pt-10">
          {groupedProducts.map((group) => {
            const typeId = group.type.id;
            const slideIndex = currentSlide[typeId] || 0;
            const maxSlide =
              Math.ceil(group.products.length / itemsPerSlide) - 1;
            const typeNameSlug = group.type.name
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <div
                key={typeId}
                className="mb-12 "
                id={group.type.name.toLowerCase().replace(/\s+/g, "-")}
              >
                <div className="flex flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="font-playfair font-bold text-xl sm:text-2xl md:text-3xl text-[#06412B] text-center sm:text-left">
                    {group.type.name.toUpperCase()}
                  </h2>
                  <Link href={`menu/${typeNameSlug}`}>
                    <button className="py-1 px-1 sm:px-4 text-[#06412B] border-2 border-[#06412B] rounded-2xl font-semibold text-sm sm:text-base">
                      See More
                    </button>
                  </Link>
                </div>

                <div className="relative">
                  {/* ปุ่มซ้าย */}
                  {slideIndex > 0 && (
                    <button
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 md:p-2"
                      onClick={() => handlePrevSlide(typeId)}
                    >
                      <MdArrowBack className="text-[#06412B] text-xl md:text-2xl" />
                    </button>
                  )}

                  {/* แสดง Card เป็น Carousel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center overflow-hidden p-3">
                    {group.products
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide
                      )
                      .map((product: Product, index: number) => (
                        <div
                          key={product.id}
                          className="bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl  w-60 lg:w-72 flex flex-col justify-between min-h-[250px]"
                        >
                          <Image
                            src={product.imageProduct}
                            layout="responsive"
                            width={1}
                            height={1}
                            style={{ aspectRatio: "1 / 1" }}
                            alt="product-image"
                            className="rounded-3xl" 
                          />
                          <h3 className="text-xl font-serif4 pt-2">
                            {(slideIndex * itemsPerSlide + index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </h3>
                          <div className="flex justify-between pb-1">
                            <h2 className="text-xl font-serif4 font-semibold">
                              {product?.name}
                            </h2>
                            <h3 className="font-serif4 text-xl font-semibold">
                              ${product?.price}
                            </h3>
                          </div>
                          <hr className="border-black" />
                          <div className="flex justify-between items-end gap-2 pt-1">
                            <p className="text-black text-md font-serif4 flex-1">
                              {product.description}
                            </p>
                            <FaCirclePlus
                              className="text-2xl cursor-pointer text-[#06412B] shrink-0"
                              onClick={() => togglePopup(product.id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* ปุ่มขวา */}
                  {slideIndex < maxSlide && (
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1 md:p-2"
                      onClick={() => handleNextSlide(typeId)}
                    >
                      <MdArrowForward className="text-[#06412B] text-xl md:text-2xl" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <FooterUser color="black" />
      </div>
    </>
  );
};

export default Menu;
