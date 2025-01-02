"use client";

import { getIngredientById } from "@/app/services/stock";
import { useEffect, useState } from "react";

interface AddIngredientProps {
    addIngredientPopup: () => void;
    stockId: string; // รับ stockId เป็น prop
}

const AddIngredient : React.FC<AddIngredientProps> = ({ addIngredientPopup, stockId }) => {
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup
    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };
    const [ingredientData, setIngredientData] = useState<any>(null); // เก็บข้อมูลส่วนผสม
    
    useEffect(() => {
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
    
        // if (stockId) {
          fetchIngredient(); // ดึงข้อมูลเมื่อ stockId มีค่า
        // }
      }, []);
    
    // const [stockData, setStockData] = useState({
    //     name: "",
    //     netQuantity: 0,
    //     unit: "",
    //     price: 0,
    //     classifier: "",
    //     totalPrice: 0,
    //     quantity: 0,
    //     description: "",
    //     stockType: "",
    //     addedDate: "",
    // });
    // const [details, setDetails] = useState([
    //     { idStock: "", manufactureDate: "", expiryDate: "" },
    // ]);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            {currentPopup === 1 && (
                <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-5 w-[90%] max-w-[520px] h-[370px] ">
                    <h2 className="text-md text-center font-bold ">{ingredientData?.name}</h2>
                    <div className="pt-2">
                        <div className="text-black ">จำนวน</div>
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                // value={netQuantity}
                                // onChange={(e) => setNetQuantity(Number(e.target.value))}
                                className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                            <p className=" text-[34px]">/</p>
                            <select
                                id="classifier"
                                // value={classifier}
                                className="w-[35%] h-[35px] border-2 border-black rounded-md pl-3"
                            // onChange={(e) => setClassifier(e.target.value)}
                            >
                                <option value="ถุง">ถุง</option>
                                <option value="ชิ้น">ชิ้น</option>
                                <option value="กล่อง">กล่อง</option>
                                <option value="อัน">อัน</option>
                            </select>
                        </div >
                    </div>
                    <div className="">
                        <div className="text-black mb-1">วันที่เพิ่มสินค้า</div>
                        <input
                            type="date"
                            // value={addedDate}
                            // onChange={(e) => setAddedDate(e.target.value)}
                            className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                    <div className="pt-[7px] ">
                        <div className="text-black mb-1">หมายเหตุ</div>
                        <textarea
                            // value={description}
                            // onChange={(e) => setDescription(e.target.value)}
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
                            onClick={goToNextPopup}
                            className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>)}
                 {/* ----nextpopup--- */} 
            {currentPopup === 2 && (
                <div className="bg-white rounded-3xl shadow-lg p-11 pt-8 w-[100%] max-w-[772px] max-h-[90%] ">
                    <h2 className="text-xl text-center font-bold ">{ingredientData?.name}</h2>
                    <div className=" overflow-auto max-h-[400px]">
                        <div className="flex flex-row justify-between pt-4">
                            <div className="text-black flex items-center text-xl pt-[23px] ">
                                01
                            </div>
                            <div className="">
                                <div className="text-black">หมายเลขไอดี</div>
                                <input
                                    type="text"
                                    // value={idStock}
                                    // onChange={(e) => setIdStock(e.target.value)}
                                    className="w-[146px] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                            </div>
                            <div className="">
                                <div className="text-black">วันที่ผลิต</div>
                                <input
                                    type="date"
                                    // value={manufactureDate}
                                    // onChange={(e) => setManufactureDate(e.target.value)}
                                    className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                            </div>
                            <div className="">
                                <div className="text-black">วันหมดอายุ</div>
                                <input
                                    type="date"
                                    // value={expiryDate}
                                    // onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between pt-9">
                        <button
                            onClick={() => setCurrentPopup(1)} // กลับไป popup แรก
                            className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                        >
                            กลับ
                        </button>
                        <button
                            className="w-[73px] h-[26px] bg-black text-white  rounded-md hover:bg-green-600 "
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default AddIngredient;
