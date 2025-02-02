// src/app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image"; // Import from 'next/image'
import { Key, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import FooterUser from "./components/footer/footerUser";
import dynamic from "next/dynamic";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const sdata = [
  {
    imageproduct:
      "https://res.cloudinary.com/donlonxid/image/upload/v1737210203/product_pics/product_pics/%E0%B8%8A%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%AD%E0%B8%99.png",
  },
  {
    imageproduct:
      "https://res.cloudinary.com/donlonxid/image/upload/v1737210203/product_pics/product_pics/%E0%B8%8A%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%AD%E0%B8%99.png",
  },
  {
    imageproduct:
      "https://res.cloudinary.com/donlonxid/image/upload/v1737210203/product_pics/product_pics/%E0%B8%8A%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%AD%E0%B8%99.png",
  },
  {
    imageproduct:
      "https://res.cloudinary.com/donlonxid/image/upload/v1737210203/product_pics/product_pics/%E0%B8%8A%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%AD%E0%B8%99.png",
  },
];

const mdata = [
  {
    name: "Chanakon",
    price: 60,
    desc: "คารฟท์โกโก้จากเกษตกรชาวนครพนม เครื่องดื่มอีกตัวที่สดชื่นและผ่อนคลาย สไตล์คนนครพนมใครอยากลอง ต้องมาเเล้วนะตอนนี้วางขายหน้าร้านเเล้วนะ แล้วเจอกัน",
  },
  {
    name: "Nakornko",
    price: 80,
    desc: "ชาไทยที่มี flavour ความหอมเหมือนเค้กกล้วยหอม นัวร์ชื่นใจแบบคนนครพนม บอกเลยใครมาต้องได้ลองสักครั้ง",
  },
];

const reviewData = [
  {
    rating: 5,
    comment: "กระป๋องกาแฟเท่มาก น้ำแข็งก้อนกลมถูกใจคอกาแฟ เข้มกล่อมกล่อม",
    order: [
      {
        name: "latte",
      },
      {
        name: "espresso",
      },
    ],
    used: {
      profileImage:
        "https://res.cloudinary.com/donlonxid/image/upload/v1736325901/profile_pics/profile_pics/5GA3T2LIo5EpxUVZb4EgXsUCqTzM.png",
      name: "jay",
    },
  },
  {
    rating: 3,
    comment: "อร่อยทุกเมนูเลย ชดชื่นมากกกกกก ไอเลิฟๆ",
    order: [
      {
        name: "milk",
      },
      {
        name: "shayen",
      },
    ],
    used: {
      profileImage:
        "https://res.cloudinary.com/donlonxid/image/upload/v1736325901/profile_pics/profile_pics/5GA3T2LIo5EpxUVZb4EgXsUCqTzM.png",
      name: "jay",
    },
  },
  {
    rating: 2,
    comment: "อร่อยทุกเมนูเลย ชดชื่นมากกกกกก ไอเลิฟๆ",
    order: [
      {
        name: "milk",
      },
      {
        name: "shayen",
      },
    ],
    used: {
      profileImage:
        "https://res.cloudinary.com/donlonxid/image/upload/v1736325901/profile_pics/profile_pics/5GA3T2LIo5EpxUVZb4EgXsUCqTzM.png",
      name: "jay",
    },
  },
  {
    rating: 1,
    comment: "อร่อยทุกเมนูเลย ชดชื่นมากกกกกก ไอเลิฟๆ",
    order: [
      {
        name: "milk",
      },
      {
        name: "shayen",
      },
    ],
    used: {
      profileImage:
        "https://res.cloudinary.com/donlonxid/image/upload/v1736325901/profile_pics/profile_pics/5GA3T2LIo5EpxUVZb4EgXsUCqTzM.png",
      name: "jay",
    },
  },
];

export default function Home() {
  useEffect(() => {
    AOS.init();
  });
  return (
    <div className="">
      <Navbar textColor="text-white" color="white" />
      <section className="min-h-screen w-auto lg:w-full font-playfair container mx-auto">
        <Image
          className="-z-10"
          src={"/assets/bgweb.png"}
          alt="A description of your image"
          layout="fill"
          objectFit="cover" // หรือ "contain" ตามความต้องการ
        />
        <div
          className=" text-white ml-16 mt-32"
          data-aos="fade-up"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="flex flex-col">
            <label className="text-5xl md:text-7xl lg:text-9xl uppercase font-semibold">
              c o f f e e
            </label>
            <span className="relative text-5xl md:text-7xl lg:text-9xl font-semibold">
              F A B L E S
              <Image
                className="absolute top-0 left-16 lg:left-80 w-[100px] md:w-[150px] lg:w-[200px]"
                src={"/assets/star.png"}
                alt="star"
                width={200}
                height={200}
              />
            </span>
          </div>

          <p className=" text-sm lg:text-lg w-full md:w-[50%] mt-16">
            With a wide range of coffee flavors, brewing methods, and add-ons,
            you can personalize your coffee experience to suit your preferences
            and indulge in different taste profiles.
          </p>
          <button className="border border-white rounded-full px-2 mt-20">
            <Link href={"/user/menu"}>
            Learn more
            </Link>
          </button>
        </div>
      </section>
      <section className="mr-24 flex justify-between font-playfair ">
        <div
          className="w-[50%]"
          data-aos="fade-right"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="relative w-[100%] h-[200px]">
            {" "}
            {/* Key change: Added width and height */}
            <img
              className="absolute top-[-72px] left-0 rounded-r-full w-[94%] h-[224%] hidden md:block"
              src={"/assets/esyen.jpg"}
              alt="esyen"

              // Important for image scaling
            />
            <img
              className="absolute -top-[140px] left-0 h-[304%] w-[100%] hidden md:block"
              src={"/assets/border.png"}
              alt="border"
            />
          </div>
        </div>
        <div
          className="flex flex-col justify-center items-center space-y-2 gap-6"
          data-aos="fade-left"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="flex flex-col ">
            <label className="text-center text-6xl">Experience</label>
            <label className="text-center text-6xl">the unique flavors </label>
            <label className="text-center text-6xl">
              of our house-roasted coffee.
            </label>
          </div>
          <button className=" border-2 border-black rounded-full lg:px-12 w-fit text-3xl ">
            <Link href={"/user/menu"}>
            Order Now
            </Link>
            
          </button>
        </div>
      </section>
      <section className=" flex justify-between mt-60 font-playfair ">
        <div
          className="flex flex-col justify-center items-center space-y-2 gap-6"
          data-aos="fade-rigth"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="flex flex-col justify-center gap-4">
            <label className="text-center text-3xl">Flavors of the Day</label>
            {mdata.map((_item: any, index: Key | null | undefined) => (
              <div key={index} className="w-1/2 flex self-center flex-col mt-4">
                {/* Display _item.name, _item.price, _item.desc here */}
                <div className="flex justify-between border-b-2 ">
                  <p className="text-xl font-semibold">{_item.name}</p>
                  <p className="text-xl font-semibold">${_item.price}</p>
                </div>
                <p className="mt-4 ">{_item.desc}</p>
              </div>
            ))}
          </div>
          <button className=" border-2 border-black rounded-full lg:px-12 w-fit text-3xl ">
            <Link href={"/user/menu"}>Learn more</Link>
            </button>
        </div>
        <div
          className="w-[50%] hidden md:block"
          data-aos="fade-right"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <div className="relative w-[100%] h-[200px]">
            {" "}
            {/* Key change: Added width and height */}
            <img
              className="absolute top-[-55px] right-0 rounded-l-full w-[94%] h-[224%] "
              src={"/assets/esyen.jpg"}
              alt="esyen"

              // Important for image scaling
            />
            <img
              className="absolute -top-[140px] right-0-0 h-[304%] w-[100%] -scale-100 "
              src={"/assets/border.png"}
              alt="border"
            />
          </div>
        </div>
      </section>
      <section
        className=" container mx-auto mt-20  flex flex-col gap-14"
        data-aos="fade-up"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
      >
        <OwlCarousel
          items={3}
          nav
          autoplay={true}
          responsive={{
            0: {
              items: 1,
            },
            600: {
              items: 2,
            },
            1000: {
              items: 3,
            },
          }}
          className=""
        >
          {sdata.map((item, index) => (
            <div
              key={index}
              className=" bg-[url('/assets/borderVertical.png')] bg-cover bg-center "
            >
              <Image
                className={`object-none`}
                src={item.imageproduct}
                alt={""}
                width={300}
                height={500}
              ></Image>
            </div>
          ))}
        </OwlCarousel>
        <button className="border border-black rounded-full px-12 py-2 text-2xl font-semibold max-w-[50vh] self-center">
          {" "}
          Order now
        </button>
      </section>
      <section className="mt-20  bg-[url('/assets/greenscreen.png')] bg-cover bg-center pb-[100px] font-playfair">
        <div className="container mx-auto text-white w-full">
          <div className="flex flex-col text-[24px] md:text-[50px] lg:text-[96px] w-full">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center justify-evenly">
                <label className="text-white">POURING</label>
                <Image
                  src={
                    "/assets/Cafe Project (2)/Remove-bg.ai_1728712670851 3.png"
                  }
                  alt={"a"}
                  layout="fit"
                  width={300}
                  height={150}
                  objectFit="cover"
                  className="rounded-full mr-2 w-[100px] md:w-[200px]"
                />
                <label className="text-white">MOMENTS</label>
              </div>
              <div className="flex items-center justify-evenly">
                <label className="text-white">OF BLISS INTO </label>
                <Image
                  src={"/assets/Cafe Project (2)/image.png"}
                  alt={"a"}
                  layout="fit"
                  width={200}
                  height={100}
                  objectFit="cover"
                  className="rounded-full mr-2  w-[100px] md:w-[150px]"
                />
                <label className="text-white">YOUR</label>
              </div>
              <div className="flex items-center justify-evenly">
                <label className="text-white">CUP OF</label>
                <Image
                  src={
                    "/assets/Cafe Project (2)/สีเขียวและสีครีม เรียบง่าย ภาพประกอบ เมนูกาแฟ Instagram Post (1).png"
                  }
                  alt={"a"}
                  layout="fit"
                  width={150}
                  height={100}
                  objectFit="cover"
                  className="rounded-full mr-2  w-[100px] md:w-[100px]"
                />
                <label className="text-white">COFFEE</label>
                <Image
                  src={"/assets/Cafe Project (2)/image-1.png"}
                  alt={"a"}
                  layout="fit"
                  width={250}
                  height={100}
                  objectFit="cover"
                  className="rounded-full mr-2  w-[100px] md:w-[150px]"
                />
              </div>
              <div className="flex items-center justify-evenly">
                <label className="text-white">AT</label>
                <Image
                  src={"/assets/Cafe Project (2)/image-2.png"}
                  alt={"a"}
                  layout="fit"
                  width={300}
                  height={100}
                  objectFit="cover"
                  className="rounded-full mr-2  w-[100px] md:w-[200px]"
                />
                <label className="text-white">FOREST TALES</label>
              </div>
            </div>
          </div>
          <div className="container mx-auto text-white p-8 bg-white bg-opacity-20 backdrop-blur-lg mt-10 rounded-3xl flex flex-col">
            <h2 className=" font-bold mb-4 self-center flex text-4xl">
              Impression
            </h2>
            <div className="space-y-6 overflow-auto scrollbar-hidden max-h-[400px]">
              {reviewData.map((review, index) => (
                <div
                  key={index}
                  className="bg-opacity-50 border-b-2 border-white p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <Image
                      src={review.used.profileImage}
                      alt={review.used.name}
                      width={50}
                      height={100}
                      className="object-cover rounded-full mr-2 "
                    />
                    <div>
                      <h3 className="font-medium text-3xl">
                        {review.used.name}
                      </h3>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-yellow-400"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mb-2 text-lg">{review.comment}</p>
                  <div className="flex gap-2">
                    {review.order.map((item, i) => (
                      <span
                        key={i}
                        className="border border-white rounded-full px-4 py-1  text-lg"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <FooterUser />
      </section>
    </div>
  );
}
