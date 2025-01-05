"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import '../../globals.css';

const Salesdata = () => {
  const [isReviewPopupOpen, setIsSalessummaryPopupOpen] = useState(false);
  const [reviewText, setSalessummary] = useState(''); // สำหรับข้อความรีวิว
  const [selectedMonth, setSelectedMonth] = useState('ธันวาคม');
  const handleChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const openSalessummaryPopup = () => {
    setIsSalessummaryPopupOpen(true);
  };

  const closeSalessummaryPopup = () => {
    setIsSalessummaryPopupOpen(false);
  };
  const orders = [
    {
      name: "Caramel Macchiato",
      total: 20,
    },
    {
      name: "Matcha cold whisk",
      total: 16,
    },
    {
      name: "Coconut matcha cream",
      total: 15,
    },
    {
      name: "Es yen (เอสเย็น)",
      total: 10,
    },
    {
      name: "Basic Late (เบสิคลาเต้)",
      total: 24,
    },
    {
      name: "Matcha cold whisk",
      total: 16,
    },
    {
      name: "Coconut matcha cream",
      total: 15,
    },
    {
      name: "Es yen (เอสเย็น)",
      total: 10,
    },
    {
      name: "Basic Late (เบสิคลาเต้)",
      total: 24,
    },
    
  ];
  // ข้อมูลยอดขาย
  const salesSummary = {
    online: 2000,
    inStore: 6000,
    total: 8000,
  };
  
  return (
    <>
      <Navbar />
      <div className="bg-[#FBF6F0] min-h-screen">
        <div className="bg-cream flex flex-col items-center justify-start p-4 pt-20">
          <div className="grid grid-cols-2 gap-4 h-full w-[95%]">
            {/* กล่องที่ 1 */}
            <div className="flex flex-col space-y-3 h-full">
              <div className="h-[60%] border-2 border-black text-center py-6 px-10 rounded-3xl ">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">จำนวนยอดขายเมนูวันนี้</h1>
                  <p className="text-lg font-bold">
                    ทั้งหมด {orders.reduce((sum, order) => sum + order.total, 0)} แก้ว
                  </p>
                </div>
                <div className="space-y-2 text-left overflow-y-scroll max-h-[160px] custom-scroll">
                  {orders.map(order => (
                    <div key={order.name} className="flex justify-between">
                      <span>{order.name}</span>
                      <span>{order.total} แก้ว</span>
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="text-xl text-center font-bold mb-8">กราฟแสดงข้อมูลยอดขาย</h2>
              <div className="h-full text-center p-4 rounded-3xl">
                
              </div>
            </div>

            {/* กล่องที่ 2 */}
            <div className="flex flex-col space-y-3 h-full">
              <div className="h-[204px] border-2 border-black text-center py-5 px-10 rounded-3xl flex flex-col justify-start items-center">
                <div className="w-full flex justify-between items-center ">
                  <h2 className="text-lg font-bold text-black">สรุปยอดขายวันนี้</h2>
                  <button className="border-2 border-black rounded-xl py-1 px-2 text-lg text-black00"
                    onClick={openSalessummaryPopup}>
                    + ยอดขายหน้าร้าน
                  </button>
                </div>
                <div className="w-full mt-3 border-t-2 border-black"></div>
                <ul className="mt-4 text-left w-full">
                  <li className="flex justify-between">
                    <span>ยอดขายออนไลน์</span>
                    <span>{salesSummary.online} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2">
                    <span>ยอดขายหน้าร้าน</span>
                    <span>{salesSummary.inStore} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2 font-bold">
                    <span>ยอดขายรวมทั้งหมด</span>
                    <span>{salesSummary.total} บาท</span>
                  </li>
                </ul>
              </div>

              <div className="h-[204px] border-2 border-black text-center py-4 px-8 rounded-3xl">
                <div className="w-full flex items-center space-x-0">
                  <span className="text-lg font-bold text-black mr-[-4px]">สรุปยอดเดือน</span>
                  <select 
                    value={selectedMonth} 
                    onChange={handleChangeMonth}
                    className="w-[82%] text-lg font-bold text-black bg-transparent max-h-12 overflow-y-auto focus:outline-none focus:ring-0"
                  >
                    <option value="กรกฎาคม">กรกฎาคม</option>
                    <option value="สิงหาคม">สิงหาคม</option>
                    <option value="กันยายน">กันยายน</option>
                    <option value="ตุลาคม">ตุลาคม</option>
                    <option value="พฤศจิกายน">พฤศจิกายน</option>
                    <option value="ธันวาคม">ธันวาคม</option>
                  </select>
                </div>
                <div className="w-full mt-3 border-t-2 border-black"></div>
                <ul className="mt-4 text-left w-full">
                  <li className="flex justify-between">
                    <span>ยอดขายออนไลน์</span>
                    <span>{salesSummary.online} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2">
                    <span>ยอดขายหน้าร้าน</span>
                    <span>{salesSummary.inStore} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2 font-bold">
                    <span>ยอดขายรวมทั้งหมด</span>
                    <span>{salesSummary.total} บาท</span>
                  </li>
                </ul>
              </div>
              
              <div className="h-[204px] border-2 border-black text-center py-4 px-8 rounded-3xl">
                <div className="w-full flex items-center space-x-0">
                  <span className="text-lg font-bold text-black mr-[-3px]">สรุปยอดปี</span>
                  <select 
                    value={selectedMonth} 
                    onChange={handleChangeMonth}
                    className="w-[86%] text-lg font-bold text-black bg-transparent focus:outline-none focus:ring-0"
                  >
                    <option value="ธันวาคม">2024</option>
                    <option value="พฤศจิกายน">2023</option>
                    <option value="ตุลาคม">2022</option>
                  </select>
                </div>
                <div className="w-full mt-3 border-t-2 border-black"></div>
                <ul className="mt-4 text-left w-full">
                  <li className="flex justify-between">
                    <span>ยอดขายออนไลน์</span>
                    <span>{salesSummary.online} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2">
                    <span>ยอดขายหน้าร้าน</span>
                    <span>{salesSummary.inStore} บาท</span>
                  </li>
                  <li className="flex justify-between mt-2 font-bold">
                    <span>ยอดขายรวมทั้งหมด</span>
                    <span>{salesSummary.total} บาท</span>
                  </li>
                </ul>
              </div>
            
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full w-[95%] mx-auto mt-24">
            <div className="h-72 border-2 border-black text-center p-4 rounded-3xl"></div>
            <div className="h-72 border-2 border-black text-center p-4 rounded-3xl"></div>
          </div>
        </div>
      </div>

      {isReviewPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-[25%] h-[30%] p-6">
            <h2 className="text-xl text-center font-bold mb-5">ยอดขายหน้าร้าน</h2>
            <input
              type="number"
              className="w-full h-12 px-2 border-2 border-black rounded-xl mb-14 focus:outline-none focus:ring focus:ring-gray-300 placeholder-left"
              placeholder="กรุณากรอกยอดขายที่หน้าร้าน"
              value={reviewText}
              onChange={(e) => setSalessummary(e.target.value)}
            />
            <div className="flex justify-between w-full">
              <button
                className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                onClick={closeSalessummaryPopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200">
                  Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </> 
  );
};

export default Salesdata;