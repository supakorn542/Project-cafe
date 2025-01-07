"use client";

import { createWithdrawal, getIngredientById } from "@/app/services/stock";
import { useEffect, useState } from "react";

interface WithdrawProps {
    withdrawalPopup: () => void;
    stockId: string; // รับ stockId เป็น prop
}


const Withdrawal: React.FC<WithdrawProps> = ({ withdrawalPopup, stockId }) => {
    const [ingredientData, setIngredientData] = useState<any>(null); // เก็บข้อมูลส่วนผสม
    const [selectedDetails, setSelectedDetails] = useState<any[]>([]);
    const [userName, setUserName] = useState("");
    const [withdrawDate, setwithdrawDate] = useState("");
    const [description, setDescription] = useState("");


    const formatDate = (date: string | undefined) => {
        if (date && date.includes('=') && date.includes(',')) {
            const seconds = Number(date.split('=')[1].split(',')[0]);
            const nanoseconds = 0;
            const fakeDate = new Date(seconds * 1000 + nanoseconds / 1000000); // nanoseconds แปลงเป็นมิลลิวินาที
            const realDate = fakeDate.toISOString().split('T')[0];
            return realDate;
        }
        return date; // คืนค่าค่าว่างหาก date ไม่มีรูปแบบที่คาดหวัง
    };

    const handleCheckboxChange = (detail: any, checked: boolean) => {
        setSelectedDetails((prev) => {
            if (checked) {
                // console.log([...prev, detail])
                return [...prev, detail]; // เพิ่ม detail หากถูกเลือก
            } else {
                // console.log(prev.filter((d) => d.id !== detail.id))
                return prev.filter((d) => d.id !== detail.id); // ลบ detail หากยกเลิกเลือก
            }
        });
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

    const handleSave = async () => {
        if (!userName || !withdrawDate || selectedDetails.length === 0) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วนและเลือกวัตถุดิบ");
            return;
        }

        const data ={
            userName,
            withdrawDate,
            description,
            quantity:selectedDetails.length,
        };

        const detailData = selectedDetails.map((detail) => ({
            idStock: detail.idStock,
            manufactureDate: detail.manufactureDate,
            expiryDate: detail.expiryDate,   
        }));

        try {
            const result = await createWithdrawal(stockId, selectedDetails, detailData, data);
            if (result.success) {
                alert("บันทึกการเบิกสำเร็จ");
                withdrawalPopup(); // ปิด popup
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.message}`);
            }
        } catch (error) {
            console.error("Error during save:", error);
            alert("ไม่สามารถบันทึกข้อมูลได้");
        }
    };


    useEffect(() => {
        fetchIngredient(); // ดึงข้อมูลเมื่อ stockId มีค่า
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-6 w-[594px] h-[618px] ">
                <h2 className="text-md text-center font-bold ">{ingredientData?.data.name}</h2>
                <div className="flex flex-row justify-between pt-5">
                    <div className="">
                        <div className="text-black pb-1">ชื่อพนักงาน</div>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                    <div className="">
                        <div className="text-black pb-1">วันที่เบิกสินค้า</div>
                        <input
                            type="date"
                            value={withdrawDate}
                            onChange={(e) => setwithdrawDate(e.target.value)}
                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <div className="text-black pb-1">หมายเหตุ</div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-[54px] border-2 border-black rounded-md pl-3 min-h-14 resize-none"
                    />
                </div>
                <div className="pt-4">
                    <div className="text-black pb-1">กรุณาเลือกหมายเลขวัตถุดิบที่เบิก</div>

                    <div className="w-full h-[216px] border-2 border-black rounded-md px-6 py-2 overflow-y-auto max-h-[500px]">
                        {ingredientData?.details?.length ? (
                            ingredientData.details.map((detail: any) => (
                                <div className="flex flex-row justify-between text-lg">
                                    <div className="flex gap-4 ">
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                handleCheckboxChange(detail, e.target.checked)
                                            } className="w-[20px] h-[40px] border-2 border-black rounded-md "
                                        />
                                        <div className="flex items-center">
                                            <span>
                                                {detail.idStock}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span>
                                            MFD : {formatDate(String(detail.manufactureDate))}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span>
                                            EXP : {formatDate(String(detail.expiryDate))}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center">ไม่มีข้อมูลวัตถุดิบ</div>
                        )}
                    </div>

                </div>
                <div className="pt-4">
                    จำนวนที่เบิก : {selectedDetails.length} กล่อง
                </div>
                <div className="flex justify-between pt-6">
                    <button
                        onClick={withdrawalPopup}
                        className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Withdrawal;