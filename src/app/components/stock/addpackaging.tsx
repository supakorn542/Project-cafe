
import { getAllIdStockFromStock, getStockById, updatePackagByIDAndAddDetail } from "@/app/services/stock";
import { useEffect, useState } from "react";
import { GrPowerCycle } from "react-icons/gr";

interface AddPackagingProps {
    addPackagingPopup: () => void;
    stockId: string; // รับ stockId เป็น prop
}

const AddPackaging: React.FC<AddPackagingProps> = ({ addPackagingPopup, stockId }) => {
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup
    const [quantity, setQuantity] = useState(0);
    const [addedDate, setAddedDate] = useState("");
    const [description, setDescription] = useState("");
    const [details, setDetails] = useState<
        Array<{ idStock: string }>
    >([]);
    const [stockData, setStockData] = useState<any>(null); // เก็บข้อมูลส่วนผสม
    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };

    const generateIdPackage = async () => {
        let newId = `PK-${Math.floor(10000 + Math.random() * 90000)}`; // สร้าง ID ใหม่
    
        // ตรวจสอบว่า ID นี้มีในฐานข้อมูลแล้วหรือไม่
        const existingIds = await getAllIdStockFromStock(); // ดึงรายการ ID ที่มีอยู่จากฐานข้อมูล
        
    
        while (existingIds.includes(newId)){
            
            newId = `${Math.floor(10000 + Math.random() * 90000)}`;
        }
        return newId
    };

    const handleDetailChange = (index: any, field: any, value: any) => {
        const updatedDetails = [...details]; // คัดลอกอาร์เรย์เก่า
        updatedDetails[index] = {
            ...updatedDetails[index],
            [field]: value, // อัปเดตค่าฟิลด์ที่ระบุ
        };
        // ;
        setDetails(updatedDetails); // อัปเดต state
    };

    const fetchStockByID = async () => {
        try {
            const data = await getStockById(stockId); // เรียกฟังก์ชัน getIngredientById
            if (data) {
                ;
                setStockData(data); // ตั้งค่าข้อมูลที่ดึงมา
            }
        } catch (error) {

            ;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
            }));

            const existingIds = await getAllIdStockFromStock(); // ดึงรายการ ID ที่มีอยู่จากฐานข้อมูล
            const hasDuplicate = newDetails.some(detail => existingIds.includes(detail.idStock));

            if (hasDuplicate) {
                alert("Error: Some idStock already exists in the database!");
                return;
            }

            try {
                const response = await updatePackagByIDAndAddDetail(stockId, updatedStockData, newDetails);
                if (response.success) {
                    alert("เพิ่มข้อมูลบรรจุภัณฑ์สำเร็จ!");
                    addPackagingPopup(); // Close the popup on success
                } else {
                    alert("เพิ่มข้อมูลบรรจุภัณฑ์ไม่สำเร็จ!");
                }
            } catch (error) {
                ;
                alert("เพิ่มข้อมูลบรรจุภัณฑ์ไม่สำเร็จ!");
            }
        }

    };



    useEffect(() => {
        fetchStockByID(); // ดึงข้อมูลเมื่อ stockId มีค่า
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20  z-50">
            <form onSubmit={handleSubmit} className="flex items-center justify-center w-[100%]">
                {currentPopup === 1 && (
                    <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-5 w-[90%] max-w-[520px] h-[370px] ">
                        <h2 className="text-md text-center font-bold ">{stockData?.data.name}</h2>
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
                                    <p className=" text-center">{stockData?.data.classifier}</p>
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
                                onClick={addPackagingPopup}
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
                        <h2 className="text-xl text-center font-bold pb-2">{stockData?.data.name}</h2>
                        <div className=" overflow-auto max-h-[220px]">
                            {quantity > 0 && Array.from({ length: quantity }).map((_, index) => (
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
                                        <div className=" text-black flex items-center text-lg ">
                                            หมายเลขไอดี :
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
                                                onClick={() => generateIdPackage().then((id_stock)=> handleDetailChange(index, "idStock", id_stock))}
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
                                onClick={handleSubmit}
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

export default AddPackaging;
