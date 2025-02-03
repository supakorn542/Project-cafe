"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import '../../globals.css';
import { createDailySales, deleteDailySales, getAllDailyInStoreSales, getAllDailyOnlineSales, getTodayInStoreSales, getTodayOnlineSales, getTodayOrders } from "@/app/services/salesdata";
import { getCartItemByCartIdFromAom } from "@/app/services/orderhistory";
import { getAllReview } from "@/app/services/review";
import { Timestamp } from "firebase/firestore";
import NavbarAdmin from "@/app/components/navbarAdmin/page";

const Salesdata = () => {
  const [isSalseDataPopupOpen, setIsSalseDataPopupOpen] = useState(false);
  const [isRecentDailySales, setIsRecentDailySales] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [allReview, setAllReviews] = useState<any[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ name: string, quantity: number }[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [saleDate, setSaleDate] = useState<any>('');
  const [saleAmount, setSaleAmount] = useState<any>(0);
  const [onlineSales, setOnlineSales] = useState<number>(0); // State สำหรับเก็บยอดขายออนไลน์
  const [inStoreSale, setInStoreSale] = useState<number>(0); // State สำหรับเก็บยอดขายออนไลน์
  const [totalOnlineSales, setTotalOnlineSales] = useState<Record<string, number>>({});
  const [totalInStoreSales, setTotalInStoreSales] = useState<Record<string, number>>({});
  const [salesData, setSalesData] = useState<Record<string, any>>({});


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ดึงข้อมูลคำสั่งทั้งหมดจาก getTodayOrders
        const todayOrders = await getTodayOrders();
        console.log("Fetched Today Orders:", todayOrders); // ดีบักข้อมูลที่ดึงมาจาก getTodayOrders

        // กรองคำสั่งที่มี statusOrder เป็น "Completed"
        const completedOrders = todayOrders.filter(order => order?.statusOrder === "Completed" || order?.statusOrder === "Received");
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


        const allonlineSales = await getAllDailyOnlineSales();
        setTotalOnlineSales(allonlineSales)
        console.log("Fetched online sales:", allonlineSales);

        const allInStoreSales = await getAllDailyInStoreSales();
        setTotalInStoreSales(allInStoreSales)
        console.log("Fetched In-Store sales:", allInStoreSales);

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);



  const totalSalesData = onlineSales + inStoreSale; // คำนวณยอดขายรวม

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

    if (!saleDate || !saleAmount) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const timestamp = Timestamp.fromDate(new Date(saleDate)); // ✅ ใช้ Timestamp
    const dateObj = new Date(saleDate);
    const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    const formattedDateThai = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')
      }/${dateObj.getFullYear()}`;

    try {
      // ตรวจสอบว่ามีข้อมูลยอดขายของวันนี้แล้วหรือไม่
      if (totalInStoreSales[formattedDate] !== undefined) {
        const confirmUpdate = window.confirm(
          `มีข้อมูลยอดขายของวันที่ ${formattedDateThai} อยู่แล้ว!\nคุณต้องการอัปเดตข้อมูลแทนหรือไม่?`
        );

        if (!confirmUpdate) {
          alert("โปรดเลือกวันใหม่ที่ยังไม่มีข้อมูล.");
          return;
        }

        await deleteDailySales(formattedDate);
        console.log(`ลบข้อมูลยอดขายของวันที่ ${formattedDateThai} สำเร็จ`);
      }

      const dailySales = {
        salesDate: timestamp, // ✅ บันทึกเป็น Timestamp
        totalSales: saleAmount,
      };

      await createDailySales(dailySales);
      alert("ยอดขายถูกบันทึกเรียบร้อยแล้ว!");

      // ปิด popup
      closeSalseDataPopup();

      // รีเฟรชข้อมูล
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
  };



  const { avgRating, starCounts } = calculateReviewSummary();

  const openSalseDataPopupOpen = () => {
    setIsSalseDataPopupOpen(true);
  };

  const openRecentDailySales = async () => {
    await fetchSalesData();
    setIsRecentDailySales(true);
  };
  
  
  const fetchSalesData = async () => {
    try {
      const fetchedOnlineSales = await getAllDailyOnlineSales();
      setTotalOnlineSales(fetchedOnlineSales);
      console.log("Fetched online sales:", fetchedOnlineSales);

      const fetchedInStoreSales = await getAllDailyInStoreSales();
      setTotalInStoreSales(fetchedInStoreSales);
      console.log("Fetched in-store sales:", fetchedInStoreSales);
      
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
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
                  <div className="flex space-x-2">
                    <button
                      className="border-2 border-black rounded-xl py-1 px-2 text-lg text-black"
                      onClick={openRecentDailySales}
                    >
                      ดูยอดขายย้อนหลัง
                    </button>
                    <button
                      className="border-2 bg-black border-black rounded-xl py-1 px-2 text-lg text-white"
                      onClick={openSalseDataPopupOpen}
                    >
                      + ยอดขายหน้าร้าน
                    </button>
                  </div>
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
                    <span>{totalSalesData} บาท</span>
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
                  <p className="text-black ml-2 text-justify">{ }</p>
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

      {isRecentDailySales && salesData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white px-12 py-8 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-lg font-bold mb-4">ยอดขายย้อนหลัง</h2>

            <div className="max-h-[360px] overflow-y-auto custom-scroll">
              <table className="w-full border-collapse min-w-[600px]">
                <thead className="bg-white sticky top-0">
                  <tr>
                    <th className="p-2 text-left">วันที่</th>
                    <th className="p-2 text-left">ยอดขายออนไลน์</th>
                    <th className="p-2 text-left">ยอดขายหน้าร้าน</th>
                    <th className="p-2 text-left font-bold">ยอดขายรวมทั้งหมด</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set([
                    ...Object.keys(totalOnlineSales),
                    ...Object.keys(totalInStoreSales),
                  ]))
                    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // เรียงวันที่จากล่าสุดไปเก่า
                    .map((date) => (
                      <tr key={date}>
                        <td className="p-2">{new Date(date).toLocaleDateString('th-TH')}</td> {/* แสดงวันที่ */}
                        <td className="p-2">{totalOnlineSales[date] || 0} บาท</td> {/* ยอดขายออนไลน์ */}
                        <td className="p-2">{totalInStoreSales[date] || 0} บาท</td> {/* ยอดขายหน้าร้าน */}
                        <td className="p-2">
                          {(
                            (totalOnlineSales[date] || 0) +
                            (totalInStoreSales[date] || 0)
                          ).toLocaleString()} บาท
                        </td> {/* ยอดขายรวม */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <button
              className="mt-10 px-4 py-2 bg-black text-white rounded-lg w-full"
              onClick={() => setIsRecentDailySales(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Salesdata;