// src/app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image"; // Import from 'next/image'
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles

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
            className="rounded-r-full"
            src={"/assets/esyen.jpg"}
            alt="iamge"
            width={400}
            height={200}
          />
        </div>
        <div
          className="flex flex-col justify-center items-center space-y-2"
          data-aos="fade-left"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <label className="text-center text-3xl">Experience</label>
          <label className="text-center text-3xl">the unique flavors </label>
          <label className="text-center text-3xl">
            of our house-roasted coffee.
          </label>
          <button className="border border-black rounded-full px-3 w-fit mt-[20px] text-xl">
            Order Now
          </button>
        </div>
      </section>
    </div>
  );
}
