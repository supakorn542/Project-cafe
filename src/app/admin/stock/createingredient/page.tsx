"use client";

import { useEffect, useState } from "react";
import { createStocks, getAllIdStockFromStock} from "../../../services/stock";
import { GrPowerCycle } from "react-icons/gr";
interface CreateIngredientProps {
    togglePopup: () => void;
}

const CreateIngredient: React.FC<CreateIngredientProps> = ({ togglePopup }) => {
    const [idStock, setIdStock] = useState("");
    const [name, setName] = useState("");
    const [netQuantity, setNetQuantity] = useState(0);
    const [unit, setUnit] = useState("");
    const [price, setPrice] = useState(0);
    const [classifier, setClassifier] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [addedDate, setAddedDate] = useState("");
    const [manufactureDate, setManufactureDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [description, setDescription] = useState("");
    const [stockType, setStockType] = useState("");
    const [details, setDetails] = useState<
        Array<{ idStock: string; manufactureDate: Date; expiryDate: Date }>
    >([]);
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup

    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };

    const formatInitialDate = (date: string | undefined) => {
        if (date && date.includes('=') && date.includes(',')) {
            const seconds = Number(date.split('=')[1].split(',')[0]);
            const nanoseconds = 0;
            const fakeDate = new Date(seconds * 1000 + nanoseconds / 1000000); // nanoseconds แปลงเป็นมิลลิวินาที
            const realDate = fakeDate.toISOString().split('T')[0];
            return realDate;
        }
        return date; // คืนค่าค่าว่างหาก date ไม่มีรูปแบบที่คาดหวัง
    };

    const generateIdIngredient = async () => {
        let newId = `IG-${Math.floor(10000 + Math.random() * 90000)}`; // สร้าง ID ใหม่

        // ตรวจสอบว่า ID นี้มีในฐานข้อมูลแล้วหรือไม่
        const existingIds = await getAllIdStockFromStock(); // ดึงรายการ ID ที่มีอยู่จากฐานข้อมูล
        console.log(existingIds)

        while (existingIds.includes(newId)) {
            console.log(newId, "XXX")
            newId = `${Math.floor(10000 + Math.random() * 90000)}`;
        }
        return newId
    };

    const formatDate = (date: Date) => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // แปลง Date เป็น string ในรูปแบบ yyyy-mm-dd
        }
        return date || ''; // หากไม่มีค่า ให้ส่งคืนค่าว่าง
    };

    const requireData = async (name: any, netQuantity: any, unit: any, price: any, classifier: any, totalPrice: any, quantity: any, addedDate: any) => {
        if (!name || !netQuantity || !unit || !price || !classifier || !totalPrice || !quantity || !addedDate) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return false;
        }
        else {
            goToNextPopup()
        }
    }

    const handleDetailChange = (index: any, field: any, value: any) => {
        const updatedDetails = [...details]; // คัดลอกอาร์เรย์เก่า
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value, // อัปเดตค่าฟิลด์ที่ระบุ
        };
        setDetails(updatedDetails); // อัปเดต state
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentPopup === 1) {
            goToNextPopup()
        } else {
            const stockData = {
                idStock,
                name,
                netQuantity,
                unit,
                price,
                classifier,
                totalPrice,
                quantity,
                addedDate,
                manufactureDate,
                expiryDate,
                description,
                stockType: "ingredient",
            };

            const stockDetails = details.map((detail) => ({
                idStock: detail.idStock,
                manufactureDate: detail.manufactureDate,
                expiryDate: detail.expiryDate,
            }));

            try {
                const response = await createStocks(stockData, stockDetails);
                if (response.success) {
                    alert("Stock created successfully!");
                    togglePopup(); // Close the popup on success

                } else {
                    alert("Failed to create Stock");
                }
            } catch (error) {
                console.error("Error creating Stock:", error);
                alert("Failed to create Stock");
            }
        }

    };

    useEffect(() => {
        setTotalPrice(quantity * price); // คำนวณ totalPrice ทุกครั้งที่ quantity หรือ price เปลี่ยนแปลง
    }, [quantity, price]);

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <form onSubmit={handleSubmit} className="flex items-center justify-center w-[100%]">
                {currentPopup === 1 && (
                    <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-4 w-[90%] max-w-[520px]  h-[90%] max-h-[630px] ">
                        <h2 className="text-md text-center font-bold ">เพิ่มวัตถุดิบ</h2>
                        <div className="">
                            <div className="text-black mb-1">ชื่อ</div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <div className="text-black ">ปริมาณสุทธิ</div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={netQuantity || ""}
                                    onChange={(e) => setNetQuantity(Number(e.target.value))}
                                    className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                                    required
                                />
                                <p className=" text-[34px]">/</p>
                                <select
                                    id="volume"
                                    value={unit}
                                    className="w-[35%] h-[35px] border-2 border-black rounded-md pl-3"
                                    onChange={(e) => setUnit(e.target.value)}
                                    required
                                >
                                    <option value="" disabled selected>กรุณาเลือก</option>
                                    <option value="ml">ml</option>
                                    <option value="g">g</option>
                                    <option value="oz">oz</option>
                                    <option value="Kg">Kg</option>
                                </select>
                            </div>
                        </div>
                        <div className="">
                            <div className="text-black ">ราคา</div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={price || ""}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                                <p className=" text-[34px]">/</p>
                                <select
                                    id="classifier"
                                    value={classifier}
                                    className="w-[35%] h-[35px] border-2 border-black rounded-md pl-3"
                                    onChange={(e) => setClassifier(e.target.value)}
                                    required
                                >
                                    <option value="" disabled selected >กรุณาเลือก</option>
                                    <option value="ถุง">ถุง</option>
                                    <option value="ชิ้น">ชิ้น</option>
                                    <option value="กล่อง">กล่อง</option>
                                    <option value="อัน">อัน</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-[7px]">
                            <div className="text-black mb-1">จำนวน</div>
                            <input
                                type="number"
                                value={quantity || ""}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                        </div>
                        <div className="">
                            <div className="text-black mb-1">ราคารวม</div>
                            <input
                                type="number"
                                disabled
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(Number(e.target.value))}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                        </div>
                        <div className="pt-[7px]">
                            <div className="text-black mb-1">วันที่เพิ่มสินค้า</div>
                            <input
                                type="date"
                                value={addedDate}
                                onChange={(e) => setAddedDate(e.target.value)}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                                required
                            />
                        </div>
                        <div className="pt-[7px]">
                            <div className="text-black mb-1">หมายเหตุ</div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md min-h-14 resize-none pl-3"
                            />
                        </div>

                        <div className="flex justify-between pt-3">
                            <button
                                onClick={togglePopup}
                                className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                                ยกเลิก
                            </button>
                            <button
                                // onClick={() => requireData(name, netQuantity,unit,price,classifier,totalPrice,quantity,addedDate)}
                                type="submit"
                                // onClick={goToNextPopup}
                                className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>)}

                {/* ----nextpopup--- */}
                {currentPopup === 2 && (
                    <div className="bg-white rounded-3xl shadow-lg p-11 pt-8 w-[100%] max-w-[772px] max-h-[90%] ">
                        <h2 className="text-xl text-center font-bold ">{name}</h2>
                        <div className=" overflow-auto max-h-[400px]">
                            {quantity > 0 && Array.from({ length: quantity }).map((_, index) => (
                                <div className="flex flex-row justify-between pt-4">
                                    <div className="text-black flex items-center text-xl pt-[23px] ">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className=" flex flex-row justify-between ">
                                        <div>
                                            <div className="text-black">หมายเลขไอดี</div>
                                            <input
                                                type="text"
                                                value={details[index]?.idStock || ""}
                                                onChange={(e) => handleDetailChange(index, "idStock", e.target.value)}
                                                className="w-[146px] h-[35px] border-2 border-black rounded-md pl-3"
                                                required
                                            />
                                        </div>
                                        <div className=" pt-7 pl-1">
                                            <button
                                                type="button"
                                                onClick={() => generateIdIngredient().then((id_stock) => handleDetailChange(index, "idStock", id_stock))}
                                                className="px-1 py-1 border-2 border-black rounded-md"
                                            >
                                                <GrPowerCycle size={18} text-black />
                                            </button>
                                        </div>

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
    );
};

export default CreateIngredient;
