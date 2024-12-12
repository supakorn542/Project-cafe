"use client";

import { useState } from "react";
import { createStocks } from "../../../services/stock";

interface AddStockProps {
    togglePopup: () => void;
}

const AddIngredient: React.FC<AddStockProps> = ({ togglePopup }) => {
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
    const [currentPopup, setCurrentPopup] = useState(1); // State สำหรับติดตาม popup

    const goToNextPopup = () => {
        setCurrentPopup(2); // ไปยัง nextpopup
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            stockType,
        };

        try {
            await createStocks(stockData);
            alert("Stock created successfully!");
            //Reset form
            setName("");
            setQuantity(0);
            setUnit("ml");
            setPrice(0);
            setClassifier("ถุง");
            setTotalPrice(0);
            setNetQuantity(0)
            setAddedDate("");
            setManufactureDate("");
            setExpiryDate("");
            setDescription("");
            setStockType("");
        } catch (error) {
            console.error("Error creating Stock:", error);
            alert("Failed to create Stock");
        }
    };

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {currentPopup === 1 && (
                <div className="bg-white rounded-3xl shadow-lg p-14 pt-4 w-[90%] max-w-[520px]  h-[90%] max-h-[630px] ">
                    <h2 className="text-md text-center font-bold ">เพิ่มวัตถุดิบ</h2>
                    <div className="">
                        <div className="text-black mb-1">ชื่อ</div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                    <div className="pt-2">
                        <div className="text-black ">ปริมาณสุทธิ</div>
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                value={netQuantity}
                                onChange={(e) => setNetQuantity(Number(e.target.value))}
                                className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                            <p className=" text-[34px]">/</p>
                            <select
                                id="volume"
                                value={unit}
                                className="w-[35%] h-[35px] border-2 border-black rounded-md pl-3"
                                onChange={(e) => setUnit(e.target.value)}
                            >
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
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-[55%] h-[35px] border-2 border-black rounded-md pl-3"
                            />
                            <p className=" text-[34px]">/</p>
                            <select
                                id="classifier"
                                value={classifier}
                                className="w-[35%] h-[35px] border-2 border-black rounded-md pl-3"
                                onChange={(e) => setClassifier(e.target.value)}
                            >
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
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(Number(e.target.value))}
                            className="w-[100%] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                    <div className="pt-[7px]">
                        <div className="text-black mb-1">จำนวน</div>
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
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
                    <h2 className="text-xl text-center font-bold ">นมโอ๊ต</h2>
                    <div className=" overflow-auto max-h-[400px]">
                        <div className="flex flex-row justify-between pt-4">
                            <div className="text-black flex items-center text-xl pt-[23px] ">
                                01
                            </div>
                            <div className="">
                                <div className="text-black">หมายเลขไอดี</div>
                                <input
                                    type="text"
                                    value={idStock}
                                    onChange={(e) => setIdStock(e.target.value)}
                                    className="w-[146px] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                            </div>
                            <div className="">
                                <div className="text-black">วันที่ผลิต</div>
                                <input
                                    type="date"
                                    value={manufactureDate}
                                    onChange={(e) => setManufactureDate(e.target.value)}
                                    className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                                />
                            </div>
                            <div className="">
                                <div className="text-black">วันหมดอายุ</div>
                                <input
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
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

        // <div className="h-screen flex items-center justify-center bg-gray-100">
        //     <form onSubmit={handleSubmit}>
        //         <div className="fixed flex flex-row inset-0 items-center justify-center bg-black bg-opacity-50 z-50">
        //             <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[400px]">
        //             <div className="text-center">
        //                 เพิ่มวัตถุดิบ
        //             </div>
        //             <div className=" pt-5">
        //                 <div>ชื่อ</div>
        //                 <input
        //                     type="text"
        //                     value={name}
        //                     onChange={(e) => setName(e.target.value)}
        //                     placeholder="Name"
        //                     className="border border-black  rounded-md "
        //                 />
        //             </div>
        //             <div className="">
        //                 <div>ปริมาณ</div>
        //                 <input
        //                     type="number"
        //                     value={quantity}
        //                     onChange={(e) => setQuantity(Number(e.target.value))}
        //                     placeholder="Quantity"
        //                     className="border border-black rounded-md"
        //                 />
        //                 <select
        //                     id="volume"
        //                     value={unit}
        //                     onChange={(e) => setUnit(e.target.value)}
        //                 >
        //                     <option value="ml">ml</option>
        //                     <option value="g">g</option>
        //                     <option value="oz">oz</option>
        //                     <option value="Kg">Kg</option>
        //                 </select>
        //             </div>
        //             <div className="">
        //                 <div>ราคา</div>
        //                 <input
        //                     type="number"
        //                     value={price}
        //                     onChange={(e) => setPrice(Number(e.target.value))}
        //                     placeholder="Price"
        //                     className="border border-black rounded-md "
        //                 />
        //                 <select
        //                     id="classifier"
        //                     value={classifier}
        //                     onChange={(e) => setClassifier(e.target.value)}
        //                 >
        //                     <option value="ถุง">ถุง</option>
        //                     <option value="ชิ้น">ชิ้น</option>
        //                     <option value="กล่อง">กล่อง</option>
        //                     <option value="อัน">อัน</option>
        //                 </select>
        //             </div>
        //             <div className="">
        //                 <div>ราคารวม</div>
        //                 <input
        //                     type="number"
        //                     value={totalPrice}
        //                     onChange={(e) => setTotalPrice(Number(e.target.value))}
        //                     placeholder="Total Price"
        //                     className="border border-black rounded-md"
        //                 />
        //             </div>
        //             <div className="">
        //                 <div>วันที่เพิ่มสินค้า</div>
        //                 <input
        //                     type="date"
        //                     value={addedDate}
        //                     onChange={(e) => setAddedDate(e.target.value)}
        //                 />
        //             </div>
        //             <div className="">
        //                 <div>วันที่ผลิต</div>
        //                 <input
        //                     type="date"
        //                     value={manufactureDate}
        //                     onChange={(e) => setManufactureDate(e.target.value)}
        //                 />
        //             </div>
        //             <div className="flex flex-row">
        //                 <div>วันหมดอายุ</div>
        //                 <input
        //                     type="date"
        //                     value={expiryDate}
        //                     onChange={(e) => setExpiryDate(e.target.value)}
        //                 />
        //             </div>
        //             <div className="flex flex-row">
        //                 <div>หมายเหตุ</div>
        //                 <input
        //                     type="text"
        //                     value={description}
        //                     onChange={(e) => setDescription(e.target.value)}
        //                     placeholder="Description"
        //                     className="border border-black rounded-md"
        //                 />
        //             </div>
        //             <button type="submit" className="border border-black ">
        //                 Submit
        //             </button>
        //             </div>

        //         </div>

        //     </form>
        // </div>

    );
};

export default AddIngredient;
