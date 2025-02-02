"use client";

import { useEffect, useState } from "react";
import { getAllIdStockFromStock, getIngredientById, updateIngredientByID, updatePackagingByID } from "../../../services/stock";
import { GrPowerCycle } from "react-icons/gr";

interface updatePackagingProps {
    updatePackagingPopup: () => void;
    stockId: string; // รับ stockId เป็น prop
}

const UpdatePackaging: React.FC<updatePackagingProps> = ({ updatePackagingPopup, stockId }) => {
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
        Array<{ id: string; idStock: string; manufactureDate: Date; expiryDate: Date }>
    >([]);
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup
    const [ingredientData, setIngredientData] = useState<any>(null); // เก็บข้อมูลส่วนผสม

    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };

    const formatTimestamp = (date: string | undefined) => {
        if (date && date.includes('=') && date.includes(',')) {
            const seconds = Number(date.split('=')[1].split(',')[0]);
            const nanoseconds = 0;
            const fakeDate = new Date(seconds * 1000 + nanoseconds / 1000000); // nanoseconds แปลงเป็นมิลลิวินาที
            const realDate = fakeDate.toISOString().split('T')[0];
            return realDate;

        }
        return date; // คืนค่าค่าว่างหาก date ไม่มีรูปแบบที่คาดหวัง
    };

    const generateIdPackage = async () => {
        let newId = `PK-${Math.floor(10000 + Math.random() * 90000)}`; // สร้าง ID ใหม่

        // ตรวจสอบว่า ID นี้มีในฐานข้อมูลแล้วหรือไม่
        const existingIds = await getAllIdStockFromStock(); // ดึงรายการ ID ที่มีอยู่จากฐานข้อมูล
        console.log(existingIds)

        while (existingIds.includes(newId)) {
            console.log(newId, "XXX")
            newId = `${Math.floor(10000 + Math.random() * 90000)}`;
        }
        return newId
    };

    // const formatDate = (date: Date) => {
    //     if (date instanceof Date) {
    //         return date.toISOString().split('T')[0]; // แปลง Date เป็น string ในรูปแบบ yyyy-mm-dd
    //     }
    //     return date || ''; // หากไม่มีค่า ให้ส่งคืนค่าว่าง
    // };


    const handleDetailChange = (index: any, field: any, value: any) => {
        console.log('LLL', value)
        const updatedDetails = [...details]; // คัดลอกอาร์เรย์เก่า
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value, // อัปเดตค่าฟิลด์ที่ระบุ
        };
        console.log(updatedDetails);
        setDetails(updatedDetails); // อัปเดต state
    };

    const fetchIngredient = async () => {
        try {
            const ingredient = await getIngredientById(stockId); // เรียกฟังก์ชัน getIngredientById
            if (ingredient) {
                console.log("fetch work!")
                console.log(ingredient);
                console.log(ingredient.details);
                setIngredientData(ingredient); // ตั้งค่าข้อมูลที่ดึงมา
                setName(ingredient.data.name); // ตั้งค่า name
                setNetQuantity(ingredient.data.netQuantity || 0); // ตั้งค่า netQuantity
                setUnit(ingredient.data.unit || ""); // ตั้งค่า unit
                setPrice(ingredient.data.price || 0); // ตั้งค่า price
                setClassifier(ingredient.data.classifier || ""); // ตั้งค่า classifier
                setTotalPrice(ingredient.data.totalPrice || details.length * price); // ตั้งค่า totalPrice
                setQuantity(ingredient.data.quantity || 0); // ตั้งค่า quantity
                setDescription(ingredient.data.description || "");
                const formattedDetails = ingredient.details.map((detail: any) => ({
                    id: detail.id,
                    idStock: detail.idStock,
                    manufactureDate: detail.manufactureDate,
                    expiryDate: detail.expiryDate

                }));
                setDetails(formattedDetails); // ตั้งค่ารายละเอียด
                // console.log(String(formattedDetails[0].expiryDate))
                // setDetails(ingredient.details || []);
                setAddedDate(ingredient.data.addedDate); // ตั้งค่า addedDate

            }
        } catch (error) {

            console.error("Error fetching ingredient:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentPopup === 1) {
            goToNextPopup()
        } else {
            // ข้อมูลที่อัปเดตจากแบบฟอร์ม
            const updatedStockData = {
                name,
                price,
                classifier,
                totalPrice,
                quantity,
                addedDate,
                description,
            };

            // รายละเอียดที่อัปเดต
            const newDetails = details.map((detail) => ({
                id: detail.id,
                idStock: detail.idStock,
            }));
            // const existingIds = await getAllIdStockFromPackages(); // ดึงรายการ ID ที่มีอยู่จากฐานข้อมูล
            // console.log("Updated existing IDs:", newDetails);
            // console.log("Updated existing IDs:", existingIds);
            // // const hasDuplicate = newDetails.some(detail => existingIds.includes(detail.idStock));
            // const hasDuplicate = newDetails.some(
            //     (detail) => existingIds.includes(detail.idStock) && detail.id !== stockId
            // );
            // console.log(hasDuplicate)
            // if (hasDuplicate) {
            //     alert("Error: Some idStock already exists in the database!");
            //     return;
            // }

            // เรียกใช้ฟังก์ชัน updateIngredientByID
            try {
                const response = await updatePackagingByID(stockId, updatedStockData, newDetails);
                if (response.success) {
                    alert("Stock updated successfully!");
                    updatePackagingPopup(); // ปิด Popup
                } else {
                    alert("Failed to update Stock");
                }
            } catch (error) {
                console.error("Error updating stock:", error);
                alert("Failed to update Stock");
            }
        }
    };



    useEffect(() => {
        fetchIngredient(); // ดึงข้อมูลเมื่อ stockId มีค่า
    }, []);

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form onSubmit={handleSubmit} className="flex items-center justify-center w-[100%]">

                {currentPopup === 1 && (
                    <div className="bg-white rounded-[2rem] shadow-lg p-16 pt-8 w-[90%] max-w-[520px]  h-[90%] max-h-[591px] ">
                        <h2 className="text-md text-center font-bold ">{ingredientData?.data.name}</h2>
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
                        <div className="">
                            <div className="text-black ">ราคา</div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={price || ""}
                                    onChange={(e) => { setPrice(Number(e.target.value)); setTotalPrice(Number(e.target.value) * details.length) }}
                                    className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                                    required
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
                        <div className="">
                            <div className="text-black mb-1">ราคารวม</div>
                            <input
                                type="text"
                                disabled
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(Number(e.target.value))}
                                className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                        </div>
                        <div className="pt-[7px]">
                            <div className="text-black mb-1">จำนวน</div>
                            <div className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3 pt-1">
                                {details.length}
                            </div>
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

                        <div className="flex justify-between pt-6">
                            <button
                                onClick={updatePackagingPopup}
                                className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>)}

                {/* ----nextpopup--- */}
                {currentPopup === 2 && (
                    <div className="bg-white rounded-[2rem] shadow-lg py-8 px-14 w-[100%] max-w-[525px] max-h-[390px] ">
                        <h2 className="text-xl text-center font-bold pb-2">{ingredientData?.data.name}</h2>
                        <div className=" overflow-auto max-h-[220px]">
                            {ingredientData?.details?.length > 0 && Array.from({ length: ingredientData?.details?.length }).map((_, index) => (
                                <div className="flex flex-row justify-between pt-4">
                                    <div className="flex flex-row">
                                        <div className=" text-black flex items-center text-xl ">
                                            แพ็คที่ :
                                        </div>
                                        <div className="w-[44px] h-[35px] flex items-center border-2 border-black rounded-md pl-3 ml-3">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <div className="text-black flex items-center text-lg">
                                            หมายเลขไอดี
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={details[index]?.idStock || ""}
                                                onChange={(e) => handleDetailChange(index, "idStock", e.target.value)}
                                                className="w-[113px] h-[35px] flex items-center border-2 border-black rounded-md pl-3 ml-3"
                                                required
                                            />
                                        </div>
                                        <div className=" flex items-center pl-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => generateIdPackage().then((id_stock) => handleDetailChange(index, "idStock", id_stock))}
                                                className="px-1 py-1 border-2 border-black rounded-md"
                                            >
                                                <GrPowerCycle size={18} text-black />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={() => setCurrentPopup(1)} // กลับไป popup แรก
                                className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                                กลับ
                            </button>
                            <button
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

export default UpdatePackaging;
