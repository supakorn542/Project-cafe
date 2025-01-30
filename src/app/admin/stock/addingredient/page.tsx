"use client";

import { getIngredientById, updateIngredientByIDAndAddDetail } from "@/app/services/stock";
import { useEffect, useState } from "react";

interface AddIngredientProps {
    addIngredientPopup: () => void;
    stockId: string; // รับ stockId เป็น prop
}

const AddIngredient: React.FC<AddIngredientProps> = ({ addIngredientPopup, stockId }) => {
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup
    const [quantity, setQuantity] = useState(0);
    const [addedDate, setAddedDate] = useState(Date);
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState<
        Array<{ idStock: string; manufactureDate: Date; expiryDate: Date }>
    >([]);
    const [ingredientData, setIngredientData] = useState<any>(null); // เก็บข้อมูลส่วนผสม
    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };

    const formatDate = (date: Date) => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // แปลง Date เป็น string ในรูปแบบ yyyy-mm-dd
        }
        return date || ''; // หากไม่มีค่า ให้ส่งคืนค่าว่าง
    };

    const handleDetailChange = (index: any, field: any, value: any) => {
        const updatedDetails = [...details]; // คัดลอกอาร์เรย์เก่า
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value, // อัปเดตค่าฟิลด์ที่ระบุ
        };
        // console.log(updatedDetails);
        setDetails(updatedDetails); // อัปเดต state
    };


    const fetchIngredient = async () => {
        try {
            const data = await getIngredientById(stockId); // เรียกฟังก์ชัน getIngredientById
            if (data) {
                console.log(data);
                setIngredientData(data); // ตั้งค่าข้อมูลที่ดึงมา
            }
        } catch (error) {

            console.error("Error fetching ingredient:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(stockId)
        if (currentPopup === 1) {
            goToNextPopup()
        } else {
            const updatedStockData = {
                quantity, // จำนวนใหม่
                addedDate, // วันที่เพิ่มใหม่
                description, // หมายเหตุ
            };

            const newDetails = details.map((detail) => ({
                idStock: detail.idStock,
                manufactureDate: detail.manufactureDate,
                expiryDate: detail.expiryDate,
            }));

            try {
                const response = await updateIngredientByIDAndAddDetail(stockId, updatedStockData, newDetails);
                if (response.success) {
                    alert("Stock add successfully!");
                    addIngredientPopup(); // Close the popup on success
                } else {
                    alert("Failed to add Stock");
                }
            } catch (error) {
                console.error("Error add Stock:", error);
                alert("Failed to add Stock");
            }
        }
    };

    useEffect(() => {
        fetchIngredient(); // ดึงข้อมูลเมื่อ stockId มีค่า
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <form onSubmit={handleSubmit} className="flex items-center justify-center w-[100%]">
                {currentPopup === 1 && (
                    <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-5 w-[90%] max-w-[520px] h-[370px] ">
                        <h2 className="text-md text-center font-bold ">{ingredientData?.data.name}</h2>
                        <div className="pt-2">
                            <div className="text-black ">จำนวน</div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={quantity || ""}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-[70%] h-[35px] border-2 border-black rounded-md pl-3"
                                    required
                                />
                                <p className=" text-[34px]">/</p>
                                <div className="w-[20%] h-[35px] border-2 border-black rounded-md pt-1">
                                    <p className=" text-center">{ingredientData?.data.classifier}</p>
                                </div>
                            </div >
                        </div>
                        <div className="">
                            <div className="text-black mb-1">วันที่เพิ่มสินค้า</div>
                            <input
                                type="date"
                                value={addedDate}
                                onChange={(e) => setAddedDate(e.target.value)}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                                required
                            />
                        </div>
                        <div className="pt-[7px] ">
                            <div className="text-black mb-1">หมายเหตุ</div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md min-h-14 resize-none pl-3"
                            />
                        </div>
                        <div className="flex justify-between pt-7">
                            <button
                                onClick={addIngredientPopup}
                                className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                                ยกเลิก
                            </button>
                            <button
                                // onClick={goToNextPopup}
                                type="submit"
                                className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>)}
                {/* ----nextpopup--- */}
                {currentPopup === 2 && (
                    <div className="bg-white rounded-3xl shadow-lg p-11 pt-8 w-[100%] max-w-[772px] max-h-[90%] ">
                        <h2 className="text-xl text-center font-bold ">{ingredientData?.data.name}</h2>
                        <div className=" overflow-auto max-h-[400px]">
                            {quantity > 0 && Array.from({ length: quantity }).map((_, index) => (
                                <div className="flex flex-row justify-between pt-4">
                                    <div className="text-black flex items-center text-xl pt-[23px] ">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className="">
                                        <div className="text-black">หมายเลขไอดี</div>
                                        <input
                                            type="text"
                                            value={details[index]?.idStock || ""}
                                            onChange={(e) => handleDetailChange(index, "idStock", e.target.value)}
                                            className="w-[146px] h-[35px] border-2 border-black rounded-md pl-3"
                                            required
                                        />
                                    </div>
                                    <div className="">
                                        <div className="text-black">วันที่ผลิต</div>
                                        <input
                                            type="date"
                                            value={formatDate(details[index]?.manufactureDate)}
                                            onChange={(e) => handleDetailChange(index, "manufactureDate", e.target.value)}
                                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                                            required
                                        />
                                    </div>
                                    <div className="">
                                        <div className="text-black">วันหมดอายุ</div>
                                        <input
                                            type="date"
                                            value={formatDate(details[index]?.expiryDate)}
                                            onChange={(e) => handleDetailChange(index, "expiryDate", e.target.value)}
                                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between pt-9">
                            <button
                                onClick={() => setCurrentPopup(1)} // กลับไป popup แรก
                                className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                                กลับ
                            </button>
                            <button
                                // onClick={handleSubmit}
                                type="submit"
                                className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
};

export default AddIngredient;
