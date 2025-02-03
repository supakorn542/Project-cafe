// src/app/page.tsx
"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Image from "next/image"; // Import from 'next/image'
import {  useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import FooterUser from "../../components/footer/footerUser";
import dynamic from "next/dynamic";
import MapComponent from "../../components/map/map";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
});
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default function AboutUs() {
    useEffect(() => {
        AOS.init();
    });
    return (
        <div className="bg-[#FBF6F0] min-h-screen overflow-y-auto">
            <Navbar textColor="text-white" color="white" />
            <section className="h-screen w-full">
                <Image
                    className="-z-12 "
                    src={"/assets/bgaboutus.jpg"}
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
                    <div className="flex flex-col leading-tight lg:pt-8 pt-10">
                        <label className=" text-3xl md:text-4xl lg:text-6xl font-semibold font-playfair">
                            Welcome to
                        </label>
                        <label className=" text-[60px] md:text-[100px] lg:text-[160px] uppercase font-semibold font-playfair">
                            f o r e s t
                            <Image
                                className="absolute md:top-[18%] md:left-[48.7%] -top-[10%] left-[48.7%]"
                                src={"/assets/star.png"}
                                alt="star"
                                width={150}
                                height={150}
                            />
                        </label>
                        <label className="relative text-[60px] md:text-[100px] lg:text-[160px] uppercase font-semibold font-playfair">
                            t a l e s
                            <Image
                                className="absolute lg:top-[40%] md:left-[23%] top-[100%]"
                                src={"/assets/star.png"}
                                alt="star"
                                width={100}
                                height={100}
                            />
                        </label>
                    </div>
                </div>
            </section>
            <section className="flex lg:justify-between justify-center item-center lg:w-full lg:mt-24  px-24 ">
                <div
                    className="w-[30%] hidden lg:block"
                    data-aos="fade-right"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    {/* <Image
                        className="rounded-r-full border border-black p-4"
                        src={"/assets/esyen.jpg"}
                        alt="iamge"
                        width={700}
                        height={200}
                    /> */}
                    <div className="relative w-[100%] h-[200px]">
                        {" "}
                        {/* <img
                            className="absolute top-[-72px] left-0 rounded-r-full w-[94%] h-[224%]"
                            src={"/assets/esyen.jpg"}
                            alt="esyen"

                        /> */}
                        <img
                            className="absolute -top-[140px] left-0 h-[304%] w-[100%]"
                            src={"/assets/2.png"}
                            alt="border"
                        />
                    </div>

                </div>

                <div
                    className="flex flex-col justify-center items-center space-y-2 gap-6 lg:w-[30%] w-[100%] "
                    data-aos="fade-up"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    <div className="flex flex-col text-[#013927] gap-7 ">
                        <label className="text-center md:text-4xl text-2xl">
                            ยินดีต้อนรับสู่ <br className="hidden lg:block" />
                        <span className=" font-playfair font-semibold">Forest Tales</span>
                        </label>
                        <label className="flex flex-col text-center md:text-2xl text-sm">
                            <span>ร้านกาแฟในโลกแห่งจินตนาการ</span>
                            <span>ที่ซ่อนตัวอยู่ในเมืองนครพนม</span>
                            <span>ดื่มด่ำไปกับความละเมียดละไมของกาแฟ</span>
                            <span>Specialty พร้อมสัมผัสบรรยากาศ</span>
                            <span>แฟนตาซีราวกับอยู่ในบ้านฮอปบิทหรือ</span>
                            <span>ป่าต้องมนต์ของแฮรี่ พอตเตอร์ ผ่อนคลาย</span>
                            <span>ท่ามกลางธรรมชาติอันร่มรื่นพร้อมลิ้มรส</span>
                            <span>กาแฟคัดสรรพิเศษจากเมล็ดกาแฟ</span>
                            <span>ที่เราคั่วเองอย่างพิถีพิถัน</span>
                        </label>
                    </div>
                </div>
                <div
                    className="w-[30%] hidden lg:block"
                    data-aos="fade-left"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    {/* <Image
                        className="rounded-r-full border border-black p-4"
                        src={"/assets/esyen.jpg"}
                        alt="iamge"
                        width={700}
                        height={200}
                    /> */}
                    <div className="relative w-[100%] h-[200px]">
                        {" "}
                        {/* <img
                            className="absolute top-[-72px] left-0 rounded-r-full w-[94%] h-[224%]"
                            src={"/assets/esyen.jpg"}
                            alt="esyen"

                        /> */}
                        <img
                            className="absolute -top-[140px] left-0 h-[304%] w-[100%] "
                            src={"/assets/1.png"}
                            alt="border"
                        />
                    </div>

                </div>
            </section>
            <section className=" flex justify-between pt-36 px-24">
                <div
                    className="flex flex-col justify-center items-center space-y-2 gap-6"
                    data-aos="fade-right"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    <div className="flex flex-col text-[#013927] gap-7 ">
                        <label className="flex flex-col text-center text-2xl ">
                            <span>นอกจากจะได้สัมผัสบรรยากาศ</span>
                            <span>แฟนตาซีและลิ้มรสกาแฟสดใหม่</span>
                            <span>ที่ร้านแล้ว Forest Tales</span>
                            <span>ยังมีโรงคั่วเมล็ดกาแฟของเราเอง</span>
                            <span>ซึ่งเราใส่ใจคัดสรรและคั่วเมล็ดกาแฟ</span>
                            <span>ทุกเมล็ดอย่างพิถีพิถันพร้อมให้</span>
                            <span>คุณเลือกซื้อเมล็ดกาแฟคั่วสด</span>
                            <span>กลับไปดื่มด่ำที่บ้านได้อีกด้วย</span>
                            <span>มาร่วมสัมผัสประสบการณ์พิเศษ</span>
                            <span>ของกาแฟคุณภาพที่ผสมผสาน</span>
                            <span>ทั้งความพิถีพิถันและมนต์เสน่ห์</span>
                            <span>ของธรรมชาติ</span>

                        </label>
                    </div>

                    {/* <button className=" border-2 border-black rounded-full lg:px-12 w-fit text-3xl ">
                        Learn more
                    </button> */}
                </div>
                <div
                    className="w-[30%]"
                    data-aos="fade-down"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    <div className="relative w-[100%] h-[200px] flex justify-center ">
                        {" "}
                        <img
                            className="absolute -top-[110px] w-[90%] h-[240%] mt-4"
                            src={"/assets/สีเขียวและสีครีม เรียบง่าย ภาพประกอบ เมนูกาแฟ Instagram Post (1).png"}
                            alt="border"
                        />
                    </div>

                </div>
                <div
                    className="flex flex-col justify-center items-center gap-6 "
                    data-aos="fade-left"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out"
                >
                    <div className="flex flex-col text-[#013927] gap-7 font-playfair">
                        <label className="flex flex-col text-center text-4xl font-semibold ">
                            <span>Don&rsquo;t miss out, try</span>
                            <span>our roasted coffee today</span>
                        </label>
                        <div>
                            <div className=" border-b-2 border-[#013927]"></div>
                        </div>
                        <div className="flex justify-center">
                            <button className=" border-2 border-[#013927] rounded-full px-6  text-xl text-[#013927] font-semibold font-serif4 ">
                                <Link href="/user/menu"> Order Now</Link>
                            </button>
                        </div>
                    </div>

                    {/* <button className=" border-2 border-black rounded-full lg:px-12 w-fit text-3xl ">
                        Learn more
                    </button> */}
                </div>
            </section>
            <section className="  mt-10 w-full bg-[url('/assets/greenscreen.png')] bg-cover bg-center h-[100%]">
                <div className=" flex flex-col justify-between ">
                    <div className=" flex flex-row justify-center items-center pt-32">
                        <div
                            className="flex flex-row justify-center items-center space-y-2 gap-6 mt-32"
                            data-aos="fade-right"
                            data-aos-delay="50"
                            data-aos-duration="1000"
                            data-aos-easing="ease-in-out"
                        >
                            <div className="flex flex-col text-white gap-7 ">
                                <label className="flex flex-col text-center text-3xl ">
                                    <span>นอกจากจะมีเมล็ดกาแฟคั่วสดจำหน่ายแล้ว</span>
                                    <span>Forest Tales ยังมีการสอนพื้นฐานเกี่ยวกับกาแฟ</span>
                                    <span>ตั้งแต่การทำกาแฟไปจนถึงการดมกลิ่นแบบ sensory</span>
                                    <span>เพื่อให้คุณเข้าใจศิลปะและศาสตร์ของการทำกาแฟ</span>
                                    <span>อย่างลึกซึ้ง สำหรับผู้ที่สนใจรามีคอร์สเรียน</span>
                                    <span>ที่ออกแบบมาให้สามารถนำความรู้</span>
                                    <span>ไปเปิดร้านกาแฟของตัวเองได้อีกด้วย</span>
                                </label>
                                <div className="flex justify-center font-playfair">
                                    <button className=" border-2 border-white rounded-full text-xl w-36  ">

                                        <Link href="https://www.facebook.com/foresttales.nkp">Learn more</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="w-[30%]"
                            data-aos="fade-down"
                            data-aos-delay="50"
                            data-aos-duration="1000"
                            data-aos-easing="ease-in-out"
                        >
                            <div className="relative w-[100%] h-[200px]">
                                {" "}
                                <img
                                    className="absolute -top-[140px] left-16 h-[250%] w-[70%] rounded-full border-2 p-2"
                                    src={"/assets/4.png"}
                                    alt="border"
                                />
                                <Image
                                    className="absolute top-[1%] left-[4%]  "
                                    src={"/assets/star.png"}
                                    alt="star"
                                    width={100}
                                    height={100}
                                />

                                <img
                                    className="absolute top-[120px] left-[320px] rounded-full border-2 p-2"
                                    src={"/assets/5.png"}
                                    alt="border"
                                />
                                  <Image
                                    className="absolute top-[47%]  left-[73.5%]  "
                                    src={"/assets/star.png"}
                                    alt="star"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </div>

                    </div>
                    <div className=" flex justify-center items-center pt-24">
                        <MapComponent />
                    </div>
                </div>
                <FooterUser />
            </section>


        </div>
    );
}
