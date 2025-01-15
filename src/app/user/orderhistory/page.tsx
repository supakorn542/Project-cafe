"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { addReviewById } from '../../services/review';
import { useAuth } from "../../context/authContext";
import { Order } from "../../interfaces/order";
import '../../globals.css';
import { CartInterface } from "@/app/interfaces/cartInterface";
import { getCartItemByCartId, getCartsByUserId,getOrdersByUserId } from "../../services/orderhistory";
import { Product } from "@/app/interfaces/product";
const TrackOrder = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("trackOrder");
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [reviewText, setReviewText] = useState(''); // สำหรับข้อความรีวิว
    const [selectedRating, setSelectedRating] = useState(0); // สำหรับการให้คะแนน
    const [orders, setOrders] = useState<Order[]>([]);
    const [carts, setCarts] = useState<CartInterface[]>([])

    useEffect(() => {
        console.log("User data:", user?.id); // ตรวจสอบข้อมูลของ user
        const fetchOrders = async () => {
            if (!user?.id) {
                console.warn("User is not logged in or userId is missing.");
                return;
            }
            else{
                try {
                    const fetchedOrders = await getOrdersByUserId(user.id); 
                    setOrders(fetchedOrders);
                    console.log(fetchedOrders)
                    const fetchedCarts = await getCartItemByCartId(user.id);
                    // setCarts(fetchedCarts);
                    // console.log("Fetched user orders:", fetchedCarts);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        };
    
        fetchOrders();
    }, [user]);

    // console.log("Carts :",carts)
    console.log("Orders :",orders)
    
    

    const convertTimestampToDate = (timestamp: any) => {
        return timestamp.toDate().toLocaleDateString("th-TH", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      };
     
    const openReviewPopup = () => {
        setIsReviewPopupOpen(true);
    };

    const closeReviewPopup = () => {
        setIsReviewPopupOpen(false);
    };

    const submitReviewById = async () => {
        const reviewId = 'custom_review_id_123'; // ระบุ ID ของรีวิวที่ต้องการ
        const newReview = {
            rating: selectedRating, // ใช้ค่าจาก rating ที่เลือก
            comment: reviewText, // ใช้ค่าจากข้อความรีวิว
            payment_id: 'payment_abc123', // ID การจ่ายเงิน
        };

        try {
            await addReviewById(reviewId, newReview); // เรียกใช้ฟังก์ชันเพิ่มรีวิว
            console.log('Review added with custom ID:', reviewId);
        } catch (error) {
            console.error('Error adding review:', error); // แสดงข้อผิดพลาดในกรณีที่เกิดข้อผิดพลาด
        }
    };
    
    return (
        <div
            className="bg-cover bg-center bg-no-repeat h-screen w-screen flex items-center justify-center"
            style={{ backgroundImage: "url('/assets/profile-background.jpg')" }}
        >
            <Navbar textColor="text-white" />
            <div className="w-5/6 h-[650px] bg-white bg-opacity-20 backdrop-blur-xl rounded-3xl p-5 mt-10">
                <div className="flex justify-around mb-5">
                    <button
                        className={`text-lg font-medium text-white relative ${activeTab === 'trackOrder' ? 'text-black' : ''}`}
                        onClick={() => setActiveTab("trackOrder")}>
                        <p className="text-4xl font-bold  group relative w-max">
                            <span>Track Order</span>
                            <span
                                className={`absolute -bottom-1 left-1/2 transition-all h-0.5 bg-white ${activeTab === 'trackOrder' ? 'w-3/6' : 'w-0'} group-hover:w-3/6`}
                            ></span>
                            <span
                                className={`absolute -bottom-1 right-1/2 transition-all h-0.5 bg-white ${activeTab === 'trackOrder' ? 'w-3/6' : 'w-0'} group-hover:w-3/6`}
                            ></span>
                        </p>
                    </button>
                    <button
                        className={`text-lg font-medium text-white relative ${activeTab === 'myPurchases' ? 'text-black' : ''}`}
                        onClick={() => setActiveTab("myPurchases")}>
                        <p className="text-4xl font-bold  group relative w-max">
                            <span>My Purchases</span>
                            <span
                                className={`absolute -bottom-1 left-1/2 transition-all h-0.5 bg-white ${activeTab === 'myPurchases' ? 'w-3/6' : 'w-0'} group-hover:w-3/6`}
                            ></span>
                            <span
                                className={`absolute -bottom-1 right-1/2 transition-all h-0.5 bg-white ${activeTab === 'myPurchases' ? 'w-3/6' : 'w-0'} group-hover:w-3/6`}
                            ></span>
                        </p>
                    </button>
                </div>
                <div className="mt-5">
                    {activeTab === "trackOrder" && (
                        <div className="flex justify-center mb-2 pl-10 pr-10">
                            <div className="w-full max-h-[550px]  overflow-y-auto flex flex-col space-y-4 scrollbar-hidden">
                                {orders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="w-full p-6 rounded-3xl border-2 border-white text-white">
                                        <div className="flex justify-between items-center mb-4">
                                            {/* <h2 className="text-white text-xl font-bold">
                                                Order Date: {
                                                    order?.orderDate
                                                    ? convertTimestampToDate(order.orderDate)
                                                    : "N/A"
                                                }
                                            </h2> */}
                                            <h3 className="text-white text-lg font-bold">
                                                {order.statusOrder}
                                            </h3>
                                        </div>
                                        {/* {order.cart_id?.product_id?.map((product: Product, idx: number) => (
                                            <div key={idx} className="flex items-start mb-3 w-full">
                                                <img
                                                src={product.image || "/default-image.jpg"}
                                                alt={product.name}
                                                className="w-20 h-20 rounded-xl mr-4"
                                                />
                                                <div className="flex flex-col justify-start">
                                                <h4 className="font-bold mb-2">{product.name}</h4>
                                                <div className="w-full flex items-start">
                                                    <div className="w-[800px]">
                                                    <p>{product.description}</p>
                                                    </div>
                                                    <div className="w-48 flex justify-end space-x-32">
                                                    <p>X {product.calorie || 1}</p>
                                                    <p>฿{product.price || 0}</p>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        ))} */}
                                        <div className="flex justify-end space-x-2">
                                            <span className="font-bold text-lg">
                                                <span className="mr-1">{order.total_price}</span>
                                                items:
                                            </span>
                                            <span className="font-bold text-lg">฿{order.total_price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* {activeTab === "myPurchases" && (
                        <div className="flex justify-center mb-2 pl-10 pr-10">
                            <div className="w-full max-h-[550px]  overflow-y-auto flex flex-col space-y-4 scrollbar-hidden">
                            {orders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="w-full p-6 rounded-3xl border-2 border-white text-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-white text-xl font-bold">
                                                Order Date: {order.orderDate}
                                            </h2>
                                            <h3 className="text-white text-lg font-bold">
                                                {order.statusOrder}
                                            </h3>
                                        </div>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-start mb-3 w-full">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-xl mr-4"
                                            />
                                            <div className="flex flex-col justify-start">
                                                <h4 className="font-bold mb-2">{item.name}</h4>
                                                <div className="w-full flex items-start">
                                                    <div className="w-[800px]">
                                                        {item.details && <p>{item.details}</p>}
                                                    </div>
                                                    <div className="w-48 flex justify-end space-x-32">
                                                        <p>X {item.quantity}</p>
                                                        <p>฿{item.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                        <div className="flex flex-col justify-end space-y-2">
                                            <div className="flex justify-end space-x-2">
                                                <span className="font-bold text-lg">
                                                    <span className="mr-1">{order.total_price}</span>
                                                    items:
                                                </span>
                                                <span className="font-bold text-lg">฿{order.total_price}</span>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                                <button className="w-24 border-2 border-white text-white p-1 rounded-xl text-xl"
                                                onClick={openReviewPopup}>
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
                {isReviewPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl w-[50%] h-[60%] p-6">
                            <h2 className="text-xl text-center font-bold mb-8">Write a Review</h2>
                            {/* Rating Section */}
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-lg font-medium">Product Quality</p>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`text-2xl ${selectedRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                            onClick={() => setSelectedRating(star)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                className="w-full h-40 p-2 border-2 border-black rounded-2xl mb-6 focus:outline-none focus:ring focus:ring-gray-300"
                                placeholder="Write your review here..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />

                            <div className="flex justify-between w-full">
                                <button
                                    className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                    onClick={closeReviewPopup}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                    onClick={submitReviewById}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TrackOrder;
