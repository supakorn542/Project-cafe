// src/app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image"; // Import from 'next/image'
import { Key, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import FooterUser from "./components/footer/footerUser";

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

export default function Home() {
  useEffect(() => {
    AOS.init();
  });
  return (
    <div>
      <Navbar />
      <section className="h-screen w-full">
        <Image
          className="-z-10"
          src="https://wallpapercave.com/wp/pHUqeRn.jpg"
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
            <label className="text-9xl uppercase font-semibold">
              c o f f e e
            </label>
            <span className="relative text-9xl font-semibold">
              F A B L E S
              <Image
                className="absolute top-0 left-80"
                src={"/assets/star.png"}
                alt="star"
                width={200}
                height={200}
              />
            </span>
          </div>

          <p className="text-lg w-[50%] mt-16">
            With a wide range of coffee flavors, brewing methods, and add-ons,
            you can personalize your coffee experience to suit your preferences
            and indulge in different taste profiles.
          </p>
          <button className="border border-white rounded-full px-2 mt-20">
            Learn more
          </button>
        </div>
      </section>
      <section className="mr-24 flex justify-between">
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <Image
            className="rounded-r-full border border-black p-4"
            src={"/assets/esyen.jpg"}
            alt="iamge"
            width={400}
            height={200}
          />
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
            Order Now
          </button>
        </div>
      </section>
      <section className=" flex justify-between mt-20">
        <div
          className="flex flex-col justify-center items-center space-y-2 gap-6"
          data-aos="fade-left"
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
            Learn more
          </button>
        </div>
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <Image
            className="rounded-l-full border border-black p-4"
            src={"/assets/esyen.jpg"}
            alt="iamge"
            width={400}
            height={200}
          />
        </div>
      </section>
      <FooterUser />
    </div>
  );
}
