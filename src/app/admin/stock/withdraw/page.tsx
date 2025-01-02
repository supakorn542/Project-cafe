"use client";

import { useState } from "react";

interface WithdrawProps {
    withdrawalPopup: () => void;
}


const Withdrawal: React.FC<WithdrawProps> = ({ withdrawalPopup }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
            <div className="bg-white rounded-[2rem] shadow-lg p-14 pt-6 w-[594px] h-[618px] ">
                <h2 className="text-md text-center font-bold ">นมโอ๊ต</h2>
                <div className="flex flex-row justify-between pt-5">
                    <div className="">
                        <div className="text-black pb-1">ชื่อพนักงาน</div>
                        <input
                            type="text"
                            // value={manufactureDate}
                            // onChange={(e) => setManufactureDate(e.target.value)}
                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                    <div className="">
                        <div className="text-black pb-1">วันที่เบิกสินค้า</div>
                        <input
                            type="text"
                            // value={expiryDate}
                            // onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-[210px] h-[35px] border-2 border-black rounded-md pl-3"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <div className="text-black pb-1">หมายเหตุ</div>
                    <textarea

                        // value={expiryDate}
                        // onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full h-[54px] border-2 border-black rounded-md pl-3 min-h-14 resize-none"
                    />
                </div>
                <div className="pt-4">
                    <div className="text-black pb-1">กรุณาเลือกหมายเลขวัตถุดิบที่เบิก</div>
                    <div className="w-full h-[216px] border-2 border-black rounded-md px-6 py-2 overflow-y-auto max-h-[500px]">
                        <div className="flex flex-row justify-between text-lg">
                            <div className="flex gap-4 ">
                                <input
                                    type="checkbox"
                                    // value={expiryDate}
                                    // onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-[20px] h-[40px] border-2 border-black rounded-md "
                                />
                                <div className="flex items-center">
                                    <span>
                                        001
                                    </span>
                                </div> 
                            </div>
                            <div className="flex items-center">
                                <span>
                                    MFD : 01-12-2025
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span>
                                    EXP : 01-12-2025
                                </span>
                            </div> 
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                    จำนวนที่เบิก : 2 กล่อง
                </div>
                <div className="flex justify-between pt-6">
                        <button
                            onClick={withdrawalPopup}
                            className="w-[73px] h-[26px] border-2 border-black text-black  rounded-md hover:bg-red-600 hover:text-white hover:border-red-600"
                        >
                            ยกเลิก
                        </button>
                        <button
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