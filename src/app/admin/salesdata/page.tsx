"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import '../../globals.css';
import { createDailySales, getTodayOrders } from "@/app/services/salesdata";
import { getCartItemByCartIdFromAom } from "@/app/services/orderhistory";

const Salesdata = () => {
  const [isReviewPopupOpen, setIsSalessummaryPopupOpen] = useState(false);
  const [reviewText, setSalessummary] = useState(''); // สำหรับข้อความรีวิว
  const [selectedMonth, setSelectedMonth] = useState('ธันวาคม');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ name: string, quantity: number }[]>([]);

  const [orders, setOrders] = useState<any[]>([]);
  const [saleDate, setSaleDate] = useState<any>('');
  const [saleAmount, setSaleAmount] = useState<any>(0);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const todayOrders = await getTodayOrders();
        setOrders(todayOrders);
        console.log("Today orders:", todayOrders);

        const cartIdsFromTodayOrders = todayOrders.map(order => order!.cart_id.id)
        const cartItemForSet = await getCartItemByCartIdFromAom(cartIdsFromTodayOrders)
        setCartItems(cartItemForSet);
        console.log("cartItems:", cartItemForSet); // ตรวจสอบข้อมูล cartItems ในวันนี้
        console.log("cartIdsFromTodayOrders:", cartIdsFromTodayOrders); // ตรวจสอบข้อมูล cartIds ในวันนี้

        // const uniqueProductNames = Array.from(new Set(cartItemForSet.map(item => item.product_id.name)));
        // console.log("Unique product names:", uniqueProductNames); // ตรวจสอบผลลัพธ์
        // const uniqueProuctQuantity = Array.from(new Set(cartItemForSet.map(item => item.quantity)));
        // console.log("Unique product names:", uniqueProductNames); // ตรวจสอบผลลัพธ์

        const productQuantities = cartItemForSet.reduce((acc: { name: string, quantity: number }[], item) => {
          const existingProduct = acc.find(product => product.name === item.product_id.name);

          if (existingProduct) {
            existingProduct.quantity += item.quantity; // ถ้ามีชื่อเดียวกันก็ให้บวก quantity
          } else {
            acc.push({ name: item.product_id.name, quantity: item.quantity }); // ถ้าไม่มีชื่อเดียวกันก็เพิ่มข้อมูลใหม่
          }

          return acc;
        }, []);

        setProductQuantities(productQuantities); // เก็บข้อมูลใน state
        console.log("productQuantities:", productQuantities); // ตรวจสอบ��ลลัพ��์ productQuantities

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault(); // ป้องกันการทำงานตามปกติของฟอร์ม

  //   if (!saleDate || saleAmount <= 0) {
  //     // เพิ่มการตรวจสอบข้อมูล ถ้าข้อมูลไม่ครบหรือยอดขายน้อยกว่า 0
  //     alert("กรุณากรอกข้อมูลทั้งหมด!");
  //     return;
  //   }

  //   try {
  //     const newSale = {
  //       salesDate: saleDate,
  //       totalSales: saleAmount,
  //     };

  //     // เรียกใช้ฟังก์ชัน createDailySales จาก service เพื่อบันทึกข้อมูล
  //     await createDailySales(newSale);

  //     // รีเซ็ตข้อมูลในฟอร์มและปิด popup
  //     setSaleDate('');
  //     setSaleAmount(0);
  //     closeSalessummaryPopup();

  //     alert("บันทึกยอดขายสำเร็จ!");
  //   } catch (error) {
  //     console.error("เกิดข้อผิดพลาดในการบันทึกยอดขาย:", error);
  //     alert("ไม่สามารถบันทึกข้อมูลยอดขายได้");
  //   }
  // };








  const handleChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const openSalessummaryPopup = () => {
    setIsSalessummaryPopupOpen(true);
  };

  const closeSalessummaryPopup = () => {
    setIsSalessummaryPopupOpen(false);
  };
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
          {/* Grid หลัก */}
          <div className="grid grid-cols-2 gap-4 w-[95%] min-h-[300px]">
            {/* กล่องที่ 1 */}
            <div className="flex flex-col space-y-3 flex-1 min-h-[300px]">
              <div className="border-2 border-black text-center py-6 px-10 rounded-3xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">จำนวนยอดขายเมนูวันนี้</h1>
                  <p className="text-lg font-bold">
                    ทั้งหมด {cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0)} แก้ว
                  </p>
                </div>
                <div className="space-y-2 text-left overflow-y-scroll max-h-[160px] custom-scroll flex-grow">
                  {productQuantities.map(item => (
                    <div key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.quantity} แก้ว</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* กล่องที่ 2 */}
            <div className="flex flex-col space-y-3 flex-1 min-h-[300px]">
              <div className="border-2 border-black text-center py-5 px-10 rounded-3xl flex flex-col justify-start items-center h-full">
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-lg font-bold text-black">สรุปยอดขายวันนี้</h2>
                  <button
                    className="border-2 border-black rounded-xl py-1 px-2 text-lg text-black00"
                    onClick={openSalessummaryPopup}
                  >
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
                    <span>{orders.reduce((sum, order) => sum + order.total_price, 0)} บาท</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* กล่องเพิ่มเติม */}
          <div className="grid grid-cols-2 gap-4 min-h-[320px] w-[95%] mx-auto mt-4">
            <div className="min-h-[320px] border-2 border-black text-center p-4 rounded-3xl">
            </div>
            <div className="min-h-[320px] border-2 border-black text-center p-4 rounded-3xl"></div>
          </div>
        </div>
      </div>

      {isReviewPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form className="bg-white rounded-3xl w-[25%] h-[40%] p-6">
            <h2 className="text-xl text-center font-bold mb-5">ยอดขายหน้าร้าน</h2>
            <input
              type="date"
              className="w-full h-12 px-2 border-2 border-black rounded-xl mb-4 focus:outline-none focus:ring focus:ring-gray-300"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
            />
            <input
              type="number"
              className="w-full h-12 px-2 border-2 border-black rounded-xl mb-14 focus:outline-none focus:ring focus:ring-gray-300 placeholder-left"
              placeholder="กรุณากรอกยอดขายที่หน้าร้าน"
              value={saleAmount}
              onChange={(e) => setSaleAmount(Number(e.target.value))}
            />
            <div className="flex justify-between w-full">
              <button
                className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                onClick={closeSalessummaryPopup}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Salesdata;