"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import '../../globals.css';
import { createDailySales, getTodayInStoreSales, getTodayOnlineSales, getTodayOrders } from "@/app/services/salesdata";
import { getCartItemByCartIdFromAom } from "@/app/services/orderhistory";
import { getAllReview } from "@/app/services/review";
import { Timestamp } from "firebase/firestore";
import NavbarAdmin from "@/app/components/navbarAdmin/page";

const Salesdata = () => {
  const [isSalseDataPopupOpen, setIsSalseDataPopupOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('ธันวาคม');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [allReview, setAllReviews] = useState<any[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ name: string, quantity: number }[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [saleDate, setSaleDate] = useState<any>('');
  const [saleAmount, setSaleAmount] = useState<any>(0);
  const [onlineSales, setOnlineSales] = useState<number>(0); // State สำหรับเก็บยอดขายออนไลน์
  const [inStoreSale, setInStoreSale] = useState<number>(0); // State สำหรับเก็บยอดขายออนไลน์

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ดึงข้อมูลคำสั่งทั้งหมดจาก getTodayOrders
        const todayOrders = await getTodayOrders();
        console.log("Fetched Today Orders:", todayOrders); // ดีบักข้อมูลที่ดึงมาจาก getTodayOrders

        // กรองคำสั่งที่มี statusOrder เป็น "Completed"
        const completedOrders = todayOrders.filter(order => order?.statusOrder === "Completed");
        console.log("Completed Orders:", completedOrders); // ดีบักคำสั่งที่ถูกกรอง

        setOrders(completedOrders);

        if (completedOrders && completedOrders.length > 0) {
          const cartIdsFromCompletedOrders = completedOrders.map(order => order?.cart_id.id);
          console.log("cartIdsFromCompletedOrders:", cartIdsFromCompletedOrders); // ดีบักข้อมูล cart_id

          // ลองตรวจสอบว่า cartIdsFromCompletedOrders มีข้อมูลหรือไม่
          if (cartIdsFromCompletedOrders.length > 0) {
            const cartItemForSet = await getCartItemByCartIdFromAom(cartIdsFromCompletedOrders);
            console.log("Fetched cart items:", cartItemForSet); // ดีบักข้อมูล cartItemForSet
            setCartItems(cartItemForSet);

            const productQuantities = cartItemForSet.reduce((acc: { name: string, quantity: number }[], item) => {
              const existingProduct = acc.find(product => product.name === item.product_id.name);
              if (existingProduct) {
                existingProduct.quantity += item.quantity;
              } else {
                acc.push({ name: item.product_id.name, quantity: item.quantity });
              }
              return acc;
            }, []);
            console.log("Product quantities:", productQuantities); // ดีบักข้อมูล productQuantities
            setProductQuantities(productQuantities);
          } else {
            console.log("No cart IDs found in today's orders.");
          }
        } else {
          console.log("No completed orders found for today.");
        }

        const review = await getAllReview();
        setAllReviews(review.filter(item => !item.deletedAt));
        console.log("Fetched reviews:", review);

        const onlineSalesAmount = await getTodayOnlineSales();
        setOnlineSales(onlineSalesAmount);
        console.log("Fetched online sales:", onlineSalesAmount);

        const inStoreSaleAmount = await getTodayInStoreSales();
        setInStoreSale(inStoreSaleAmount);
        console.log("Fetched in-store sales:", inStoreSaleAmount);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
}, []);

  

  const totalSales = onlineSales + inStoreSale; // คำนวณยอดขายรวม

  const calculateReviewSummary = () => {
    if (allReview.length === 0) return { avgRating: 0, starCounts: [0, 0, 0, 0, 0] };

    const starCounts = [0, 0, 0, 0, 0];
    let totalRating = 0;

    allReview.forEach(({ rating }) => {
      if (rating >= 1 && rating <= 5) {
        starCounts[5 - rating] += 1; // ปรับ index ให้ตรงกับตำแหน่งของดาว
        totalRating += rating;
      }
    });

    return {
      avgRating: (totalRating / allReview.length).toFixed(1),
      starCounts,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // แปลง saleDate จาก string เป็น Timestamp
    const timestamp = Timestamp.fromDate(new Date(saleDate)); // แปลงเป็น Timestamp

    if (saleDate && saleAmount) {
      const dailySales = {
        salesDate: timestamp, // ส่งเป็น Timestamp
        totalSales: saleAmount,
      };

      try {
        await createDailySales(dailySales);
        alert("ยอดขายถูกบันทึกเรียบร้อยแล้ว!");
        closeSalseDataPopup();
        // เรียกข้อมูลยอดขายใหม่หลังจากบันทึกข้อมูล
        const updatedOnlineSales = await getTodayOnlineSales();
        const updatedInStoreSales = await getTodayInStoreSales();  
        setOnlineSales(updatedOnlineSales);
        setInStoreSale(updatedInStoreSales);
        setSaleDate('');
        setSaleAmount(0); 

      } catch (error) {
        console.error("Error saving sales data:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกยอดขาย");
      }
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const { avgRating, starCounts } = calculateReviewSummary();

  const handleChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const openSalseDataPopupOpen = () => {
    setIsSalseDataPopupOpen(true);
  };

  const closeSalseDataPopup = () => {
    setIsSalseDataPopupOpen(false);
    setSaleDate('');
    setSaleAmount(0); 
  };

  return (
    <>
      <NavbarAdmin />
      <div className="bg-[#FBF6F0] min-h-screen">
        <div className="bg-cream flex flex-col items-center justify-start p-4 pt-20">
          {/* Grid หลัก */}
          <div className="grid grid-cols-2 gap-4 w-[95%] min-h-[300pปx]">
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
                    className="border-2 bg-black border-black rounded-xl py-1 px-2 text-lg text-white"
                    onClick={openSalseDataPopupOpen}
                  >
                    + ยอดขายหน้าร้าน
                  </button>
                </div>
                <ul className="mt-10 text-left w-full">
                  <li className="flex justify-between">
                    <span>ยอดขายออนไลน์</span>
                    <span>{onlineSales} บาท</span>
                  </li>
                  <li className="flex justify-between mt-4 mb-4">
                    <span>ยอดขายหน้าร้าน</span>
                    <span>{inStoreSale} บาท</span>
                  </li>
                  <div className="w-full mt-8 border-t-2 border-black"></div>
                  <li className="flex justify-between mt-10 font-bold">
                    <span>ยอดขายรวมทั้งหมด</span>
                    <span>{totalSales} บาท</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* กล่องเพิ่มเติม */}
          <div className="grid grid-cols-2 gap-4 min-h-[320px] w-[95%] mx-auto mt-4">
            <div className="min-h-[320px] px-8 py-4 pt-6 pb-6 border-2 border-black text-center rounded-3xl overflow-y-auto flex flex-col gap-4 custom-scroll max-h-[300px]">
              {allReview.map((review, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{review.user_id.username}</h3>
                    <div className="flex space-x-0 tracking-tight">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-2xl ${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-black ml-2 text-justify">{}</p>
                  <p className="text-black ml-2 text-justify">{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="min-h-[320px] border-2 border-black text-center px-9 py-4 rounded-3xl">
              <h2 className="text-xl font-bold mb-4">คะแนนการรีวิว</h2>
              <div className="text-4xl font-bold">{avgRating}</div>
              <div className="text-lg">{allReview.length} เรตติ้ง</div>
              <div className="mt-4 space-y-1">
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <div key={star} className="flex items-center">
                    <span className="text-xl">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < star ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </span>
                    <div className="w-full bg-gray-200 h-2 mx-2 rounded">
                      <div
                        className="bg-yellow-500 h-2 rounded"
                        style={{ width: `${(starCounts[5 - star] / allReview.length) * 100}%` }}
                      ></div>
                    </div>
                    <span>{starCounts[5 - star]}</span>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>

      {isSalseDataPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-[25%] h-[40%] p-6">
            <h2 className="text-xl text-center font-bold mb-5">ยอดขายหน้าร้าน</h2>
            <input
              type="date"
              className="w-full h-12 px-2 border-2 border-black rounded-xl mb-4 focus:outline-none focus:ring focus:ring-gray-300"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
            />
            <input
              type="number"
              value={saleAmount || ""}
              className="w-full h-12 px-2 border-2 border-black rounded-xl mb-14 focus:outline-none focus:ring focus:ring-gray-300 placeholder-left"
              placeholder="กรุณากรอกยอดขายที่หน้าร้าน"
              onChange={(e) => setSaleAmount(Number(e.target.value))}
            />
            <div className="flex justify-between w-full">
              <button
                className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                onClick={closeSalseDataPopup}
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