"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Stock } from "@/app/interfaces/stock";
import { Withdrawal as withdrawals } from "@/app/interfaces/withdrawal";
import Withdrawal from "../withdraw/page";
import CreateIngredient from "../createingredient/page";
import CreatePackaging from "../createpackaging/page";
import AddIngredient from "../addingredient/page";
import AddPackaging from "../addpackaging/page";
import { deletedStock, getStockIngredients, getStockPackags, getWithdrawals } from "@/app/services/stock";
import UpdateIngredient from "../updateingredient/page";
import UpdatePackaging from "../updatepackaging/page";
import NavbarAdmin from "@/app/components/navbarAdmin/page";


const ShowStock = () => {
    const [ingredients, setIngredients] = useState<Stock[]>([]); // State สำหรับเก็บข้อมูล stocks
    const [packages, setPackages] = useState<Stock[]>([]);
    const [pg, setPg] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<withdrawals[]>([]);
    const [activeTab, setActiveTab] = useState<"ingredients" | "packaging" | "withdrawal">("ingredients");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [withdrawalPopupOpen, setWithdrawalPopupOpen] = useState(false);
    const [addIngredientPopupOpen, setAddIngredientPopupOpen] = useState(false);
    const [addPackagingPopupOpen, setAddPackagingPopupOpen] = useState(false);
    const [updateIngredientPopupOpen, setUpdateIngredientPopupOpen] = useState(false);
    const [updatePackagingPopupOpen, setUpdatePackagingPopupOpen] = useState(false);
    const [selectedStockId, setSelectedStockId] = useState(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState(null);
    const [searchItem, setSearchItem] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchItem(event.target.value);
      };

    const filteredIngredients = ingredients.filter((ingredient) => {
        const search = searchItem.toLowerCase();
        return (
            ingredient.name.toLowerCase().includes(search) ||
            ingredient.description.toLowerCase().includes(search)
        );
    });
    const filteredPackages = packages.filter((packages) => {
        const search = searchItem.toLowerCase();
        return (
            packages.name.toLowerCase().includes(search) ||
            packages.description.toLowerCase().includes(search)
        );
    });
    const filteredWithdrawals = withdrawals.filter((withdrawals) => {
        const search = searchItem.toLowerCase();
        return (
            withdrawals.name.toLowerCase().includes(search) ||
            withdrawals.userName.toLowerCase().includes(search) ||
            withdrawals.description.toLowerCase().includes(search)
        );
    });
    

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const withdrawalPopup = (stockId: any) => {
        setSelectedIngredientId(stockId);
        setWithdrawalPopupOpen(!withdrawalPopupOpen);
    };

    const addIngredientPopup = (stockId: any) => {
        setSelectedStockId(stockId);
        setAddIngredientPopupOpen(!addIngredientPopupOpen);
    };

    const updateIngredientPopup = (stockId: any) => {
        setSelectedStockId(stockId);
        setUpdateIngredientPopupOpen(!updateIngredientPopupOpen);
    };

    const updatePackagingPopup = (stockId: any) => {
        setSelectedStockId(stockId);
        setUpdatePackagingPopupOpen(!updatePackagingPopupOpen);
    };

    const addPackagingPopup = (stockId: any) => {
        setSelectedStockId(stockId);
        setAddPackagingPopupOpen(!addPackagingPopupOpen);
    };

    // const formatDate = (date: String) => {
    //     if (date) {
    //         const seconds = Number(date.split('=')[1].split(',')[0])
    //         const nanoseconds = 0;
    //         const fakeDate = new Date(seconds * 1000 + nanoseconds / 1000000); // nanoseconds แปลงเป็นมิลลิวินาที
    //         const realDate = fakeDate.toISOString().split('T')[0]
    //         // ฟังก์ชัน format วันที่
    //         return String(realDate); // แปลง Date เป็น string ในรูปแบบ yyyy-mm-dd
    //     }
    //     return date || ''; // หากไม่มีค่า ให้ส่งคืนค่าว่าง
    // };

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


    const fetchStockIngredients = async () => {
        try {
            const ingredientData = await getStockIngredients();
            setIngredients(ingredientData); // เก็บข้อมูลใน state
            console.log(ingredientData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchStockPackages = async () => {
        try {
            const packageData = await getStockPackags();
            setPackages(packageData); // เก็บข้อมูลใน state
            console.log(packageData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchWithdrawals = async () => {
        try {
            const withdrawalData = await getWithdrawals();
            setWithdrawals(withdrawalData); // เก็บข้อมูลใน state
            console.log(withdrawalData);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = (id: string) => {
        console.log(id)
        if (window.confirm("Are you sure you want to delete this item?")) {
            deletedStock(id);
            fetchStockIngredients(); // เรียก API เมื่อ component ถูก mount
            fetchStockPackages();
        }

    };

    useEffect(() => {
        fetchStockIngredients(); // เรียก API เมื่อ component ถูก mount
        fetchStockPackages();
        fetchWithdrawals();
    }, []);


    const renderContent = () => {
        switch (activeTab) {
            case "ingredients":
                return (
                    <div className="pt-2 flex justify-center ">
                        <div className="flex flex-col items-center w-[90%] h-[30rem] border-[3px] border-black  rounded-[2rem] max-h-[500px] overflow-y-scroll custom-scroll">
                            {filteredIngredients.map((ingredient) =>
                                <div className="flex justify-between w-[92%] border-b-[2px] border-black pt-8 pb-10">
                                    <div className="w-[15%] h-full text-2xl font-semibold text-center flex items-start justify-center" >
                                        <span> {ingredient.name} </span>
                                    </div>
                                    <div className="w-[17%] h-full font-semibold flex flex-col items-start justify-start" >
                                        <div className="flex flex-col">
                                            <span> ปริมาณ : {ingredient.netQuantity} {ingredient.unit} / {ingredient.classifier}  </span>
                                            <span> จำนวน : {ingredient.quantity} {ingredient.classifier}</span>
                                        </div>
                                    </div>
                                    <div className="w-[17%] h-full  font-semibold flex flex-col items-start justify-start" >
                                        <span> ราคา : {ingredient.price} บาท / {ingredient.classifier} </span>
                                        <span> ราคารวม : {ingredient.totalPrice} บาท</span>
                                    </div>
                                    <div className="w-[17%] h-full  font-semibold flex flex-col justify-center" >
                                        <span> วันที่เพิ่ม : {formatDate(String(ingredient.addedDate))} </span>
                                        <div> หมายเหตุ : <span className=" w-full h-full text-sm font-playfair  break-words">{ingredient.description} </span></div>
                                    </div>
                                    <div className="flex items-start w-[25%] h-full">
                                        <div className=" flex flex-row justify-between gap-2" >
                                            <button
                                                onClick={() => withdrawalPopup(ingredient.id)}
                                                className="w-[115px] h-8  rounded-3xl font-semibold text-white bg-black">
                                                - เบิกของ
                                            </button>

                                            <button
                                                onClick={() => addIngredientPopup(ingredient.id)}
                                                className="w-[115px] h-8 border-2 border-black rounded-3xl font-semibold  ">
                                                + เพิ่มของ
                                            </button>


                                            <div>
                                                <button
                                                    onClick={() => updateIngredientPopup(ingredient.id)}
                                                    className="">
                                                    <svg
                                                        className="h-7 w-7  "
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div>
                                                <button onClick={() => handleDelete(ingredient.id!)}>
                                                    <svg
                                                        className="h-7 w-7 text-black"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" />
                                                        <line x1="4" y1="7" x2="20" y2="7" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div></div>
                                    {/* <div className="w-[28%] h-full pt-9 flex flex-row justify-between " >
                                        <button
                                            onClick={() => withdrawalPopup(ingredient.id)}
                                            className="w-[120px] h-8   rounded-3xl font-semibold text-white bg-black">
                                            - เบิกของ
                                        </button>

                                        <button
                                            onClick={() => addIngredientPopup(ingredient.id)}
                                            className="w-[120px] h-8 border-2 border-black rounded-3xl font-semibold  ">
                                            + เพิ่มของ
                                        </button>


                                        <div>
                                            <button
                                                onClick={() => updateIngredientPopup(ingredient.id)}
                                                className="">
                                                <svg
                                                    className="h-7 w-7  "
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div>
                                            <button onClick={() => handleDelete(ingredient.id!)}>
                                                <svg
                                                    className="h-7 w-7 text-black"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1="4" y1="7" x2="20" y2="7" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div> */}
                                </div>)}

                        </div>
                        {withdrawalPopupOpen && <Withdrawal withdrawalPopup={() => withdrawalPopup(selectedIngredientId)} stockId={selectedIngredientId!} />}
                        {addIngredientPopupOpen && <AddIngredient addIngredientPopup={() => addIngredientPopup(selectedStockId)} stockId={selectedStockId!} />}
                        {updateIngredientPopupOpen && <UpdateIngredient updateIngredientPopup={() => updateIngredientPopup(selectedStockId)} stockId={selectedStockId!} />}

                    </div>

                );


            case "packaging":
                return (
                    <div className="pt-2 flex justify-center ">
                        <div className="flex flex-col items-center  w-[90%] h-[30rem] border-[3px] border-black  rounded-[2rem] overflow-y-scroll custom-scroll max-h-[500px]">
                            {filteredPackages.map((packaging) =>
                                <div className="flex flex-row justify-between w-[90%] min-h-[25%] border-b-[2px] border-black ">
                                    <div className="w-[15%] h-full font-semibold text-2xl  text-center flex items-center justify-center" >
                                        <span> {packaging.name} </span>
                                    </div>
                                    <div className="w-[17%] h-full font-semibold flex flex-col justify-center" >

                                        <span> ราคา : {packaging.price} บาท / {packaging.classifier} </span>
                                        <span> ราคารวม : {packaging.totalPrice} บาท</span>

                                    </div>
                                    <div className="w-[17%] h-full  font-semibold pt-8" >
                                        <span> จำนวน : {packaging.quantity} {packaging.classifier} </span>

                                    </div>
                                    <div className="w-[17%] h-full  font-semibold flex flex-col justify-center" >
                                        <span> วันที่เพิ่ม : {formatDate(String(packaging.addedDate))} </span>
                                        <span> หมายเหตุ : {packaging.description}</span>
                                    </div>
                                    <div className="w-[28%] h-full pt-9 flex flex-row justify-between " >
                                        <button
                                            onClick={() => withdrawalPopup(packaging.id)}
                                            className="w-[120px] h-8   rounded-3xl font-semibold text-white bg-black"
                                        >
                                            - เบิกของ
                                        </button>
                                        {/* {withdrawalPopupOpen && <Withdrawal withdrawalPopup={withdrawalPopup} />} */}
                                        <button
                                            onClick={() => addPackagingPopup(packaging.id)}
                                            className="w-[120px] h-8 border-2 border-black rounded-3xl font-semibold  ">
                                            + เพิ่มของ
                                        </button>

                                        <div>
                                            <button
                                                onClick={() => updatePackagingPopup(packaging.id)}
                                                className="">
                                                <svg
                                                    className="h-7 w-7  "
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div>
                                            <button onClick={() => handleDelete(packaging.id!)}>
                                                <svg
                                                    className="h-7 w-7 text-black"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1="4" y1="7" x2="20" y2="7" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div>
                                </div>)}
                        </div>
                        {withdrawalPopupOpen && <Withdrawal withdrawalPopup={() => withdrawalPopup(selectedIngredientId)} stockId={selectedIngredientId!} />}
                        {/* {addIngredientPopupOpen && <AddIngredient addIngredientPopup={() => addIngredientPopup(selectedStockId)} stockId={selectedStockId!} />} */}
                        {/* {withdrawalPopupOpen && <Withdrawal withdrawalPopup={withdrawalPopup} />} */}
                        {addPackagingPopupOpen && <AddPackaging addPackagingPopup={() => addPackagingPopup(selectedStockId)} stockId={selectedStockId!} />}
                        {updatePackagingPopupOpen && <UpdatePackaging updatePackagingPopup={() => updatePackagingPopup(selectedStockId)} stockId={selectedStockId!} />}

                    </div>
                );
            case "withdrawal":
                return (
                    <div className="pt-2 flex justify-center ">
                        <div className="flex flex-col items-center w-[90%] h-[30rem] border-[3px] border-black rounded-[2rem] overflow-y-scroll custom-scroll max-h-[500px] pt-4">
                            {filteredWithdrawals.map((withdrawal) =>
                                <div className="flex flex-row justify-between pt-5 w-[90%]  pb-8 border-b-[2px] border-black ">
                                    <div className="w-[15%] h-full   text-2xl font-semibold text-center " >
                                        <span> {withdrawal.name} </span>
                                    </div>
                                    <div className="w-[20%] h-full font-semibold flex flex-col " >
                                        <span> จำนวนที่เบิก : {withdrawal.quantity}  แพ็ค</span>
                                        {withdrawal.details.map((detail: any) => (
                                            <span> id : {detail.idStock}</span>
                                        ))}

                                    </div>
                                    <div className="w-[20%] h-full  font-semibold  flex flex-col " >
                                        <span> วันที่เบิก : {formatDate(String(withdrawal.withdrawalDate))} </span>
                                        <span> พนักงานที่เบิก : {withdrawal.userName} </span>
                                    </div>
                                    <div className="w-[30%] h-full  font-semibold  flex flex-col " >
                                        <span> หมายเหตุ : {withdrawal.description}</span>
                                    </div>

                                </div>)}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <NavbarAdmin />
            <div className="bg-[#FBF6F0] h-screen ">
                <div className="flex justify-center pt-20">
                    <div className="flex flex-row items-center justify-center w-[90%] h-20  gap-10">
                        <div className="pl-[3.5rem]">
                            <div className="flex flex-row items-center w-[403px] h-[41px] border-[3px] border-black rounded-[2rem] px-4 placeholder:text-black">
                                <svg
                                    className="h-5 w-5 text-[#013927]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    className="ml-2 flex-grow outline-none bg-[#FBF6F0]"
                                    type="text"
                                    placeholder="Search"
                                    value={searchItem}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between w-full font-playfair">
                            <div className="flex flex-row justify-between items-center  w-[85%]  border-black">
                                <div className="">
                                    <button
                                        className={`pl-6 pr-6 h-10 border-black rounded-3xl text-2xl font-semibold ${activeTab === "ingredients" ? "bg-[#013927] text-white" : "hover:bg-[#013927] hover:text-white"
                                            }`}
                                        onClick={() => setActiveTab("ingredients")}
                                    >
                                        Ingredients
                                    </button>
                                </div>
                                <div className="">
                                    <button
                                        className={`pl-6 pr-6 h-10 border-black rounded-3xl text-2xl font-semibold ${activeTab === "packaging" ? "bg-[#013927] text-white" : "hover:bg-[#013927] hover:text-white"
                                            }`}
                                        onClick={() => setActiveTab("packaging")}
                                    >
                                        Packaging
                                    </button>
                                </div>

                                <div className="">
                                    <button
                                        className={`pl-6 pr-6 h-10 border-black rounded-3xl text-2xl font-semibold ${activeTab === "withdrawal" ? "bg-[#013927] text-white" : "hover:bg-[#013927] hover:text-white"
                                            }`}
                                        onClick={() => setActiveTab("withdrawal")}
                                    >
                                        Withdrawal details
                                    </button>
                                </div>
                            </div>

                            <div className=" pr-6 ">
                                <button
                                    onClick={togglePopup}
                                    hidden={activeTab === "withdrawal"}
                                >
                                    <svg
                                        className="w-[45px] h-[45px] text-white bg-[#013927] rounded-3xl "
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                            </div>
                            {isPopupOpen && (
                                activeTab === "ingredients" ?
                                    <CreateIngredient togglePopup={togglePopup} />
                                    : activeTab === "packaging" ?
                                        <CreatePackaging togglePopup={togglePopup} />
                                        : null
                            )}
                        </div>
                    </div>
                </div>
                {renderContent()}
            </div>
        </>
    );
};

export default ShowStock;
