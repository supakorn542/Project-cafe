"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { getCartItemByCartIdFromAom, getFinishOrders, getOrders, getProcessOrders, updateStatusOrderByID, updateStatusPaymentByID } from "@/app/services/order";
import { Order } from "@/app/interfaces/order";
import { DiVim } from "react-icons/di";
import { stringify } from "querystring";


const ShowOrder = () => {
    const [activeTab, setActiveTab] = useState<"orderToDays" | "processedOrders" | "finishOrder">("orderToDays");
    const [orders, setOrders] = useState<any[]>([]);

    const [cartIds, setcartIds] = useState<any[]>([]);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const [processOrders, setProcessOrders] = useState<any[]>([]);
    const [cartIdProcess, setcartIdProcess] = useState<any[]>([]);
    const [cartItemProcess, setCartItemProcess] = useState<any[]>([]);

    const [finishOrders, setFinishOrders] = useState<any[]>([]);
    const [cartIdFinish, setcartIdFinish] = useState<any[]>([]);
    const [cartItemFinish, setCartItemFinish] = useState<any[]>([]);

    const [statusOrder, setStatusOrder] = useState<{ [key: string]: string }>({});
    const [button, setButton] = useState<{ [key: string]: boolean }>({});

    const formatDate = (date: string | undefined) => {
        if (date && date.includes('=') && date.includes(',')) {
            const seconds = Number(date.split('=')[1].split(',')[0]);
            const nanoseconds = 0;
            const fakeDate = new Date(seconds * 1000 + nanoseconds / 1000000); // แปลง timestamp เป็นวันที่

            // ฟอร์แมตวันที่ในภาษาไทย
            const dateOptions: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            };
            const formattedDate = new Intl.DateTimeFormat('th-TH', dateOptions).format(fakeDate);

            // ฟอร์แมตเวลาในภาษาอังกฤษ เพื่อให้ได้ AM/PM
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // ใช้ฟอร์แมต 12 ชั่วโมง
            };
            const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(fakeDate);

            // รวมวันที่และเวลา
            return `${formattedDate} ${formattedTime}`;
        }
        return date; // คืนค่าค่าว่างหาก date ไม่มีรูปแบบที่คาดหวัง
    };

    const updatedStatusPayment = async (orderId: string, status: string) => {
        try {
            const response = await updateStatusPaymentByID(orderId, status);
            if (response.success) {
                alert("Stock updated successfully!");

            } else {
                alert("Failed to update Stock");
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Failed to update Stock");
        }
    }

    const updatedStatusOrder = async (orderId: string, statusOrder: string) => {
        try {
            const response = await updateStatusOrderByID(orderId, statusOrder);
            if (response.success) {
                alert("StatusOrder updated successfully!");
                fetchProcessOrders()
                fetchFinishOrders()
                setButton((prev) => ({
                    ...prev,
                    [orderId]: false,
                }));
            } else {
                alert("Failed to update StatusOrder");
            }
        } catch (error) {
            console.error("Error updating StatusOrder:", error);
            alert("Failed to update StatusOrder");
        }
    }

    const setStatusAndButton = (value: string, orderId: string) => {
        setStatusOrder((prev) => ({
            ...prev,
            [orderId]: value, // เปลี่ยนเฉพาะ orderId ที่ระบุ
        }));

        // แสดงหรือซ่อนปุ่มตามการเลือกใน select
        if (value) {
            setButton((prev) => ({
                ...prev,
                [orderId]: true, // แสดงปุ่มเมื่อมีการเลือกค่า
            }));
        } else {
            setButton((prev) => ({
                ...prev,
                [orderId]: false, // ซ่อนปุ่มเมื่อไม่ได้เลือก
            }));
        }
    };

    // const setStatusAndButton = async (value: string) => {
    //     setStatusOrder(value)
    //     setButton(true)
    // }

    const fetchOrders = async () => {
        const orders = await getOrders();
        setOrders(orders);
        console.log(orders)

        const cartIds = orders.map((order) => {
            return order!.cart_id.id;
        });
        setcartIds(cartIds)
        console.log(cartIds)

        const cartItems = await getCartItemByCartIdFromAom(cartIds)
        setCartItems(cartItems)
        console.log("ERTYUIKNBTUI", cartItems)

        //cartItemsที่ดึงออกมาตอนนี้จะเป็นแบบ เช่น 3 obj. แยกกันแต่ cart_id เดียวกัน
        //งั้นเราอาจจะทำให้มันเก็บแบบ ทุกcartItemsที่มี cart_id เดียวกัน รวมเป็นหนึ่ง
    };

    const fetchProcessOrders = async () => {
        const processOrders = await getProcessOrders();
        setProcessOrders(processOrders);

        // ตั้งค่า statusOrder ให้ตรงกับสถานะที่ดึงมา
        const initialStatus = processOrders.reduce((acc, order) => {
            acc[order.id] = order.statusOrder; // สมมติ statusOrder เป็นชื่อฟิลด์ของสถานะใน order
            return acc;
        }, {});
        setStatusOrder(initialStatus);

        const cartIds = processOrders.map((order) => order!.cart_id.id);
        setcartIdProcess(cartIds);

        const cartItems = await getCartItemByCartIdFromAom(cartIds);
        setCartItemProcess(cartItems);
    };

    const fetchFinishOrders = async () => {
        const getfinishOrders = await getFinishOrders();
        setFinishOrders(getfinishOrders);
        console.log(getfinishOrders)

        const cartIds = getfinishOrders.map((order) => {
            return order!.cart_id.id;
        });
        setcartIdFinish(cartIds)
        console.log(cartIds)

        const cartItems = await getCartItemByCartIdFromAom(cartIds)
        setCartItemFinish(cartItems)
        console.log(cartItems)
    };


    useEffect(() => {
        fetchOrders()
        fetchProcessOrders()
        fetchFinishOrders()
    }, []);


    const renderContent = () => {
        switch (activeTab) {
            case "orderToDays":
                return (
                    <div className="pt-2 flex flex-col items-center justify-center gap-4">
                        {cartIds.map(i => (
                            <div className="flex flex-col w-[90%] overflow-y-auto max-h-[500px] ">
                                <div className=" border-[3px] border-[#013927]  rounded-[2rem] ">
                                    {orders.filter(item => item.cart_id.id == i).map(x => (
                                        <div className="flex justify-between p-6 px-16">
                                            <div className=" text-lg font-semibold w-[40%] ">
                                                <span className="font-playfair">Username : </span>
                                                <span>{x.cart_id.user_id.firstName} {x.cart_id.user_id.lastName}</span>
                                            </div>
                                            {/* <div className=" flex flex-row justify-between items-center w-[20%]">
                                                <div className=" text-xl font-semibold ">
                                                    status :
                                                </div>
                                                <div>
                                                    <select
                                                        id="volume"
                                                        className="w-[171px] h-[35px] border-2 border-[#013927]  rounded-2xl pl-3 bg-[#FBF6F0]"
                                                    >
                                                        <option value="" disabled selected>ยืนยันออเดอร์</option>
                                                        <option value="ml">ยืนยันออเดอร์</option>
                                                        <option value="g">ชำระเงินไม่ถูกต้อง</option>
                                                        <option value="g">กำลังทำ</option>
                                                        <option value="oz">ออเดอร์เสร็จสิ้น</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>))}
                                    <div className=" flex justify-between   px-16  pb-6">
                                        <div className="flex flex-col w-[25%] gap-4 ">
                                            {cartItems.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="flex flex-col ">
                                                    <div className="flex justify-between">
                                                        <span className="font-playfair">
                                                            Menu: {x.product_id.name}
                                                        </span>
                                                        <span>
                                                            X{x.quantity}
                                                        </span>
                                                    </div>
                                                    {/* <span>คั่วอ่อน (Ethiopia)</span> */}
                                                    <span>{x.optionitem_id[0] ? x.optionitem_id[0].name : x.optionitem_id[1].name ? x.optionitem_id[1].name : ""}</span>

                                                    <div>หมายเหตุ: {x.description}</div>
                                                    <span>ราคา: {x.product_id.price} ฿</span>
                                                </div>))}
                                        </div>

                                        <div className="border-l-[2.5px] border-[#013927]  "></div>
                                        <div className="flex flex-col w-[27%] gap-1">
                                            {orders.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="">
                                                    <span className=" font-semibold ">วันที่สั่งซื้อ : </span>
                                                    <span>{formatDate(String(x.orderDate))}</span>
                                                </div>
                                            ))}
                                            <div>
                                                <span className=" font-semibold">วันที่รับสินค้า : </span>
                                                <span>20-04-2024 , 12:00 pm</span>
                                            </div>
                                            {orders.filter(item => item.cart_id.id == i).map(x => (
                                                <div>
                                                    <span className=" font-semibold">เบอร์โทรศัพท์ : </span>
                                                    <span> {x.cart_id.user_id.telNumber}</span>
                                                </div>
                                            ))}

                                        </div>
                                        <div className="border-l-[2.5px] border-black "></div>
                                        {orders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className="w-[18%]">
                                                <div>
                                                    ยอดรวมทั้งหมด {x.total_price}฿
                                                </div>
                                                <div>
                                                    ตรวจสอบการชำระ :
                                                    <img src="/assets/bill.jpg" alt="" className="w-24 "     />
                                                    {/* <Image
                                                        // alt="Profile"
                                                        className="rounded-3xl object-cover"
                                                        // src={product.imageProduct || ""}
                                                        width={80}
                                                        height={80}
                                                    /> */}
                                                </div>
                                            </div>
                                        ))}
                                        {orders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className=" flex justify-between items-end  w-[22%] ">
                                                <button className="w-[130px] h-[29px] font-semibold border-2 border-black text-white text-sm bg-black rounded-xl" onClick={() => { updatedStatusPayment(x.id, "Completed") }}> ยืนยันออเดอร์ </button>
                                                <button className="w-[130px] h-[29px] font-semibold border-2 border-black text-black text-sm rounded-xl" onClick={() => { updatedStatusPayment(x.id, "Uncompleted") }}> ชำระเงินไม่ถูกต้อง </button>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>)
                        )}
                    </div>

                );


            case "processedOrders":
                return (
                    <div className="pt-2 flex flex-col items-center justify-center gap-4">
                        {cartIdProcess.map(i => (
                            <div className=" flex flex-col w-[90%] overflow-y-auto max-h-[500px] ">
                                <div className=" border-[3px] border-black  rounded-[2rem] ">
                                    {processOrders.filter(item => item.cart_id.id == i).map(x => (
                                        <div className="flex justify-between p-6 px-16">
                                            <div className=" text-lg font-semibold w-[40%] ">
                                                Username : {x.cart_id.user_id.firstName} {x.cart_id.user_id.lastName}
                                            </div>
                                            <div className=" flex flex-row justify-between items-center w-[20%]">
                                                <div className=" text-xl font-semibold ">
                                                    status :
                                                </div>
                                                <div>
                                                    <select
                                                        id="statusOrder"
                                                        value={statusOrder[x.id] || x.statusOrder}
                                                        onChange={(e) => setStatusAndButton(e.target.value, x.id)}
                                                        className="w-[171px] h-[35px] border-2 border-[#013927]  rounded-2xl pl-3 bg-[#FBF6F0]"
                                                    >
                                                        {x.statusOrder == "Pending" ? (<option value="Pending" disabled>ยังไม่ทำออเดอร์</option>) : (<option value="Pending" >ยังไม่ทำออเดอร์</option>)}
                                                        <option value="Processing">กำลังทำออเดอร์</option>
                                                        <option value="Completed">ออเดอร์เสร็จสิ้น</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className=" flex justify-between  px-16  pb-6">
                                        <div className="flex flex-col w-[25%] gap-4 ">
                                            {cartItemProcess.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="flex flex-col ">
                                                    <div className="flex justify-between">
                                                        <span>
                                                            Menu: {x.product_id.name}
                                                        </span>
                                                        <span>
                                                            X{x.quantity}
                                                        </span>
                                                    </div>
                                                    {/* <span>คั่วอ่อน (Ethiopia)</span> */}
                                                    <span>{x.optionitem_id[0] ? x.optionitem_id[0].name : x.optionitem_id[1].name ? x.optionitem_id[1].name : ""}</span>

                                                    <div>หมายเหตุ: {x.description}</div>
                                                    <span>ราคา: {x.product_id.price} ฿</span>
                                                </div>))}
                                        </div>

                                        <div className="border-l-[2.5px] border-black "></div>
                                        <div className="flex flex-col w-[27%] gap-1">
                                            {processOrders.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="">
                                                    <span className=" font-semibold ">วันที่สั่งซื้อ : </span>
                                                    <span>{formatDate(String(x.orderDate))}</span>
                                                </div>
                                            ))}
                                            <div>
                                                <span className=" font-semibold">วันที่รับสินค้า : </span>
                                                <span>20-04-2024 , 12:00 pm</span>
                                            </div>
                                            {processOrders.filter(item => item.cart_id.id == i).map(x => (
                                                <div>
                                                    <span className=" font-semibold">เบอร์โทรศัพท์ : </span>
                                                    <span> {x.cart_id.user_id.telNumber}</span>
                                                </div>
                                            ))}

                                        </div>
                                        <div className="border-l-[2.5px] border-black "></div>
                                        {processOrders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className="w-[18%]">
                                                <div>
                                                    ยอดรวมทั้งหมด {x.total_price}฿
                                                </div>
                                                <div>
                                                    ตรวจสอบการชำระ :
                                                    <img src="/assets/bill.jpg" alt="" className="w-24 "     />

                                                </div>
                                            </div>
                                        ))}
                                        {processOrders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className=" flex justify-between items-end  w-[20%] ">
                                                {button[x.id] && (<div>
                                                    <button className="w-[110px] h-[28px] font-semibold border-2 border-black text-white bg-black rounded-xl" onClick={() => { updatedStatusOrder(x.id, statusOrder[x.id]) }}> Done </button>
                                                    <button className="w-[110px] h-[28px] font-semibold border-2 border-black text-black rounded-xl" onClick={() => setStatusAndButton("", x.id)}> Cancel </button>
                                                </div>)}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>)
                        )}
                    </div>



                );
            case "finishOrder":
                return (
                    <div className="pt-2 flex flex-col items-center justify-center gap-4">
                        {cartIdFinish.map(i => (
                            <div className=" flex flex-col w-[90%] overflow-y-auto max-h-[500px] ">
                                <div className=" border-[3px] border-black  rounded-[2rem] ">
                                    {finishOrders.filter(item => item.cart_id.id == i).map(x => (
                                        <div className="flex justify-between p-6 px-16">
                                            <div className=" text-lg font-semibold w-[40%] ">
                                                Username : {x.cart_id.user_id.firstName} {x.cart_id.user_id.lastName}
                                            </div>
                                            <div className=" flex flex-row justify-between items-center w-[20%]">
                                                <div className=" text-xl font-semibold ">
                                                    status :
                                                </div>
                                                <div>
                                                    <select
                                                        id="statusOrder"
                                                        value={statusOrder[x.id] || x.statusOrder}
                                                        onChange={(e) => setStatusAndButton(e.target.value, x.id)}
                                                        className="w-[171px] h-[35px] border-2 border-[#013927]  rounded-2xl pl-3 bg-[#FBF6F0]"
                                                    >
                                                        {x.statusOrder !== "Received" ? (<option value="Completed">รอลูกค้ามารับ</option>) : (<option value="Completed" disabled>รอลูกค้ามารับ</option>)}
                                                        <option value="Received">ลูกค้ารับแล้ว</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className=" flex justify-between  px-16  pb-6">
                                        <div className="flex flex-col w-[25%] gap-4 ">
                                            {cartItemFinish.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="flex flex-col ">
                                                    <div className="flex justify-between font-notoSansThai">
                                                        <span>
                                                            Menu: {x.product_id.name}
                                                        </span>
                                                        <span>
                                                            X{x.quantity}
                                                        </span>
                                                    </div>
                                                    {/* <span>คั่วอ่อน (Ethiopia)</span> */}
                                                    <span>{x.optionitem_id[0] ? x.optionitem_id[0].name : x.optionitem_id[1].name ? x.optionitem_id[1].name : ""}</span>

                                                    <div>หมายเหตุ: {x.description}</div>
                                                    <span>ราคา: {x.product_id.price} ฿</span>
                                                </div>))}
                                        </div>

                                        <div className="border-l-[2.5px] border-black "></div>
                                        <div className="flex flex-col w-[27%] gap-1">
                                            {finishOrders.filter(item => item.cart_id.id == i).map(x => (
                                                <div className="">
                                                    <span className=" font-semibold ">วันที่สั่งซื้อ : </span>
                                                    <span>{formatDate(String(x.orderDate))}</span>
                                                </div>
                                            ))}
                                            <div>
                                                <span className=" font-semibold">วันที่รับสินค้า : </span>
                                                <span>20-04-2024 , 12:00 pm</span>
                                            </div>
                                            {finishOrders.filter(item => item.cart_id.id == i).map(x => (
                                                <div>
                                                    <span className=" font-semibold">เบอร์โทรศัพท์ : </span>
                                                    <span> {x.cart_id.user_id.telNumber}</span>
                                                </div>
                                            ))}

                                        </div>
                                        <div className="border-l-[2.5px] border-black "></div>
                                        {finishOrders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className="w-[18%]">
                                                <div>
                                                    ยอดรวมทั้งหมด {x.total_price}฿
                                                </div>
                                                <div>
                                                    ตรวจสอบการชำระ :
                                                    <img src="/assets/bill.jpg" alt="" className="w-24 "     />

                                                </div>
                                            </div>
                                        ))}
                                        {finishOrders.filter(item => item.cart_id.id == i).map(x => (
                                            <div className=" flex justify-between items-end  w-[20%] ">
                                                {button[x.id] && (<div>
                                                    <button className="w-[110px] h-[28px] font-semibold border-2 border-black text-white bg-black rounded-xl" onClick={() => { updatedStatusOrder(x.id, statusOrder[x.id]) }}> Done </button>
                                                    <button className="w-[110px] h-[28px] font-semibold border-2 border-black text-black rounded-xl" onClick={() => setStatusAndButton("", x.id)}> Cancel </button>
                                                </div>)}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>)
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div >
            <Navbar />
            <div className="bg-[#FBF6F0] min-h-screen">
                <div className="flex justify-center pt-20 pb-5 ml-6">
                    <div className="flex justify-center w-[20%]">
                        <button
                            className={`pl-6 pr-6 h-10 font-playfair  border-black rounded-3xl text-2xl font-semibold hover:border-2 ${activeTab === "orderToDays" ? "border-2" : " hover:border-2"}`}
                            onClick={() => setActiveTab("orderToDays")}
                        >
                            ORDER TO DAY
                        </button>
                    </div>

                    <div className="flex justify-center w-[20%]">
                        <button
                            className={`pl-6 pr-6 h-10 font-playfair  border-black rounded-3xl text-2xl font-semibold hover:border-2 ${activeTab === "processedOrders" ? "border-2" : " hover:border-2"}`}
                            onClick={() => setActiveTab("processedOrders")}
                        >
                            PROCESSED ORDER
                        </button>
                    </div>

                    <div className="flex justify-center w-[20%]">
                        <button
                            className={`pl-6 pr-6 h-10 font-playfair  border-black rounded-3xl text-2xl font-semibold hover:border-2 ${activeTab === "finishOrder" ? "border-2" : " hover:border-2"}`}
                            onClick={() => setActiveTab("finishOrder")}
                        >
                            FINISH ORDER
                        </button>
                    </div>

                </div>
                {renderContent()}

            </div>
        </div>
    );
};

export default ShowOrder;
