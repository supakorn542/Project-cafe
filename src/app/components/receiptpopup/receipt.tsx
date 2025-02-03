import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const ReceiptPopup = ({ receiptUrl } : any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* รูปภาพเล็กที่คลิกได้ */}
            <img 
                src={receiptUrl} 
                alt="Receipt" 
                className="w-24 cursor-pointer" 
                onClick={() => setIsOpen(true)} 
            />

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-2xl">
                        {/* ปุ่มปิด Modal */}
                        <button 
                            className="absolute -top-4 -right-7 text-gray-600 hover:text-gray-900 text-2xl"
                            onClick={() => setIsOpen(false)}
                        >
                            <AiOutlineClose className="text-white " /> 
                        </button>

                        {/* รูปภาพใหญ่ใน Modal */}
                        <img 
                            src={receiptUrl} 
                            alt="Full Receipt" 
                            className="max-w-full max-h-[80vh] rounded-lg" 
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ReceiptPopup;