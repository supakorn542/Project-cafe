"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { createReview, deleteReview, getReviewByUserId, updateReview } from '../../services/review';
import { useAuth } from "../../context/authContext";
import { Order } from "../../interfaces/order";
import '../../globals.css';
import { CartItemsInterface } from "@/app/interfaces/cartItemInterface";
import { getCartItemByCartId, getCartsByUserId, getCompletedOrdersByUserId, getOrdersByUserId } from "../../services/orderhistory";
import { Product } from "@/app/interfaces/product";
import Image from "next/image";
import { Review } from "@/app/interfaces/review";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
const TrackOrder = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("trackOrder");
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [isViewReviewPopupOpen, setIsViewReviewPopupOpen] = useState(false);
    const [updateReviewPopup, setUpdateReviewPopup] = useState(false);
    const [reviewText, setReviewText] = useState(''); // สำหรับข้อความรีวิว
    const [selectedRating, setSelectedRating] = useState(0); // สำหรับการให้คะแนน
    const [orders, setOrders] = useState<any[]>([]);
    const [carts, setCarts] = useState<any[]>([]);
    const [cartsids, setCartsIds] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [statusComplete, setStatusComplete] = useState<any[]>([]);
    const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
    const [showReview, setshowReview] = useState<any>([]);

    useEffect(() => {
        console.log("User data:", user?.id); // ตรวจสอบข้อมูลของ user
        const fetchOrders = async () => {
            if (!user?.id) {
                console.warn("User is not logged in or userId is missing.");
                return;
            }
            else {
                try {
                    const review = await getReviewByUserId(user.id);
                    setReviews(review.filter(item => !item.deletedAt));
                    console.log("reviews :", review)
                    console.log(review.filter(item => !item.deletedAt))
                    const fetchedOrders = await getOrdersByUserId(user.id);
                    setOrders(fetchedOrders);
                    console.log("fetchedOrders: ", fetchedOrders)

                    const cartIds = fetchedOrders.map((order) => {
                        return order!.cart_id.id;
                    });
                    setCartsIds(cartIds)
                    console.log(cartIds)

                    const fetchedCompletedOrders = await getCompletedOrdersByUserId(user.id);
                    setStatusComplete(fetchedCompletedOrders)
                    console.log("JUKKRUUUU", fetchedCompletedOrders);

                    const fetchedCarts = await getCartItemByCartId(user.id);
                    setCarts(fetchedCarts);
                    console.log("fetchedCarts :", fetchedCarts)

                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        };

        fetchOrders();
    }, [user]);

    // console.log("Carts :",carts)




    const convertTimestampToDate = (timestamp: any) => {
        let date: Date;

        if (timestamp?.toDate) {
            // กรณี Firebase Timestamp
            date = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            // กรณีเป็น Date Object
            date = timestamp;
        } else if (typeof timestamp === "string" || typeof timestamp === "number") {
            // กรณีเป็น String หรือ Number
            date = new Date(timestamp);
        } else {
            throw new Error("Invalid timestamp format");
        }

        return date.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };

    const closeReviewPopup = () => {
        setIsReviewPopupOpen(false);
        setCurrentReviewId(null);
        setReviewText('');
        setSelectedRating(0);
    };

    const openReviewPopup = (id: string) => {
        setCurrentReviewId(id);
        setIsReviewPopupOpen(true);
    };

    const openViewReviewPopupOpen = (orderId: string) => {
        try {
            if (!user?.id) return;

            // ดึงข้อมูลรีวิวที่สัมพันธ์กับ user_id และ order_id
            const reviewsForOrder = reviews.filter(
                (review) => review.user_id.id === user.id && review.order_id.id === orderId
            );

            if (reviewsForOrder.length > 0) {
                setCurrentReviewId(reviewsForOrder[0].id);
                setIsViewReviewPopupOpen(true);
                setshowReview(reviewsForOrder[0]); // ตั้งค่าข้อมูลรีวิวที่เลือก
            } else {
                console.warn("No review found for the given order.");
            }
        } catch (error) {
            console.error("Error fetching review for order:", error);
        }
    };


    const closeViewReviewPopupOpen = () => {
        setIsViewReviewPopupOpen(false);
    };

    const openupdateReviewPopup = () => {
        setReviewText(showReview.comment);  // โหลดข้อความรีวิวที่มีอยู่
        setSelectedRating(showReview.rating);  // โหลดคะแนนรีวิวที่มีอยู่
        setUpdateReviewPopup(true);
    };

    const closeupdateReviewPopup = () => {
        setUpdateReviewPopup(false);
    };


    const handleDeleteReview = async (reviewId: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteReview(reviewId);
                alert("Review deleted successfully.");
                setIsViewReviewPopupOpen(false);
                fetchReviews();
            } catch (error) {
                alert("An error occurred while deleting the review.");
            }
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsSnapshot = await getDocs(collection(db, "reviews"));
            const reviewsData = reviewsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReviews(reviewsData); // อัปเดต State ด้วยข้อมูลล่าสุดจาก Firebase
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };


    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าหลังจาก submit form

        if (!user?.id) {
            console.warn("User is not logged in.");
            return;
        }

        if (selectedRating === 0 || !reviewText.trim()) {
            alert("Please provide a rating and a review text.");
            return;
        }

        if (!currentReviewId) {
            alert("Unable to identify the review context.");
            return;
        }

        const reviewData = {
            user_id: user.id,
            rating: selectedRating,
            comment: reviewText,
            order_id: currentReviewId,

        };

        try {
            await createReview(reviewData);
            alert("Review submitted successfully.");
            setIsReviewPopupOpen(false);
            setSelectedRating(0);
            setReviewText('');
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An error occurred while submitting your review.");
        }
    };

    const submitUpdateReview = async (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าหลังจาก submit form
    
        if (!user?.id) {
            console.warn("User is not logged in.");
            return;
        }
    
        if (selectedRating === 0 || !reviewText.trim()) {
            alert("Please provide a rating and a review text.");
            return;
        }
    
        if (!currentReviewId) {
            alert("Unable to identify the review context.");
            return;
        }
    
        const reviewData: Review = {
            user_id: user.id,
            rating: selectedRating,
            comment: reviewText,
            order_id: currentReviewId,
        };
    
        try {
            // อัพเดทรีวิว
            await updateReview(currentReviewId, reviewData);
            alert("Review updated successfully.");
            setIsReviewPopupOpen(false);
            setUpdateReviewPopup(false);
            setSelectedRating(0);
            setReviewText('');
        } catch (error) {
            console.error("Error updating review:", error);
            alert(error instanceof Error ? error.message : "An error occurred while updating your review.");
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
                                            <h2 className="text-white text-xl font-bold">
                                                Order Date: {
                                                    order?.orderDate
                                                        ? convertTimestampToDate(order.orderDate)
                                                        : "N/A"
                                                }
                                            </h2>
                                            <h3 className="text-white text-lg font-bold">
                                                {order.statusOrder}
                                            </h3>
                                        </div>
                                        {carts.filter(item => item.cart_id.id == order.cart_id.id).map((value, idx) => (
                                            <div key={idx} className="flex items-start mb-3 w-full">
                                                <Image
                                                    src={value.product_id.imageProduct}
                                                    width={85}
                                                    height={100}
                                                    style={{ aspectRatio: '1 / 1' }}
                                                    alt="Image"
                                                    className="rounded-xl mr-4 "
                                                ></Image>
                                                <div className="flex flex-col justify-start text-white">
                                                    <h4 className="font-bold mb-2">{value.product_id.name}</h4>
                                                    <div className="w-full flex items-start">
                                                        <div className="w-[800px] flex">
                                                            {value.optionitem_id.map((i: any) =>
                                                                <p className="mr-3">{i.name}</p>
                                                            )}


                                                        </div>
                                                        <div className="w-48 flex justify-between space-x-32">
                                                            <p>X {value.quantity}</p>
                                                            <p>฿{value.product_id.price || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-end space-x-2">
                                            <span className="font-bold text-lg">
                                                <span className="mr-1">{carts
                                                    .filter(item => item.cart_id.id == order.cart_id.id)
                                                    .reduce((acc, item) => acc + item.quantity, 0)}
                                                </span>
                                                items:
                                            </span>
                                            <span className="font-bold text-lg">฿{order.total_price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "myPurchases" && (
                        <div className="flex justify-center mb-2 pl-10 pr-10">
                            <div className="w-full max-h-[550px]  overflow-y-auto flex flex-col space-y-4 scrollbar-hidden">
                                {statusComplete.map((value, index) => (
                                    <div
                                        key={index}
                                        className="w-full p-6 rounded-3xl border-2 border-white text-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-white text-xl font-bold">
                                                Order Date: {
                                                    value?.orderDate
                                                        ? convertTimestampToDate(value.orderDate)
                                                        : "N/A"
                                                }
                                            </h2>

                                            <h3 className="text-white text-lg font-bold">
                                                {value.statusOrder}
                                            </h3>
                                        </div>
                                        {carts.filter(item => item.cart_id.id == value.cart_id.id).map((value, idx) => (
                                            <div key={idx} className="flex items-start mb-3 w-full">
                                                <Image
                                                    src={value.product_id.imageProduct}
                                                    width={85}
                                                    height={100}
                                                    style={{ aspectRatio: '1 / 1' }}
                                                    alt="Image"
                                                    className="rounded-xl mr-4 "
                                                ></Image>
                                                <div className="flex flex-col justify-start">
                                                    <h4 className="font-bold mb-2">{value.product_id.name}</h4>
                                                    <div className="w-full flex items-start">
                                                        <div className="w-[800px]">
                                                            {value.optionitem_id.map((i: any) =>
                                                                <p className="mr-3">{i.name}</p>
                                                            )}
                                                        </div>
                                                        <div className="w-48 flex justify-end space-x-32">
                                                            <p>X {value.quantity}</p>
                                                            <p>฿{value.product_id.price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex flex-col justify-end space-y-2">
                                            <div className="flex justify-end space-x-2">
                                                <span className="font-bold text-lg">
                                                    <span className="mr-1">{carts
                                                        .filter(item => item.cart_id.id == value.cart_id.id)
                                                        .reduce((acc, item) => acc + item.quantity, 0)}
                                                    </span>
                                                    items:
                                                </span>
                                                <span className="font-bold text-lg">฿{value.total_price}</span>
                                            </div>
                                            {reviews.filter((item) => item.order_id.id === value.id && !item.deletedAt).length > 0 ? (
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="w-36 border-2 border-white text-white p-1 rounded-xl text-xl"
                                                        onClick={() => openViewReviewPopupOpen(value.id)}
                                                    >
                                                        View Review
                                                    </button>
                                                </div>
                                            ) : (
                                                // ถ้าไม่มีรีวิวให้แสดงปุ่ม Review
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="w-24 border-2 border-white text-white p-1 rounded-xl text-xl"
                                                        onClick={() => openReviewPopup(value.id)}
                                                    >
                                                        Review
                                                    </button>
                                                </div>
                                            )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {isReviewPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <form className="bg-white rounded-3xl w-[50%] h-[60%] p-6" onSubmit={submitReview}>
                            <h2 className="text-xl text-center font-bold mb-8">Write a Review</h2>
                            {/* Rating Section */}
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-lg font-medium">Product Quality</p>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`text-2xl ${selectedRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // ถ้าคลิกดาวที่เลือกแล้วอยู่แล้ว จะทำการยกเลิกเฉพาะดาวนั้น
                                                if (selectedRating === star) {
                                                    setSelectedRating(selectedRating - 1); // ลบดาวนั้นออก
                                                } else {
                                                    setSelectedRating(star); // เลือกดาวที่คลิก
                                                }
                                                console.log(`Selected rating: ${selectedRating}`);
                                            }}
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
                                    type="submit"
                                    className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {isViewReviewPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl w-[40%] h-auto p-6 shadow-lg">
                            <h2 className="text-xl text-center font-bold mb-4">My review</h2>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <Image
                                        src={showReview.user_id.profileImage}
                                        alt="Profile"
                                        width={60}
                                        height={60}
                                        style={{ aspectRatio: '1 / 1' }}
                                        className="rounded-full border-2 border-white mr-2"
                                    />
                                    <p className="text-lg font-medium">{showReview.user_id.username}</p>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            className={`text-2xl ${index < showReview.rating ? "text-yellow-500" : "text-gray-300"
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-black  mb-16 text-justify">
                                {showReview.comment}</p>
                            <div className="flex justify-between">
                                <button
                                    className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                    onClick={closeViewReviewPopupOpen}
                                >
                                    Back
                                </button>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                        onClick={() => handleDeleteReview(showReview.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="px-4 py-1 bg-black text-white rounded-3xl text-sm hover:opacity-80 transition duration-200"
                                        onClick={openupdateReviewPopup}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {updateReviewPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <form
                            className="bg-white rounded-3xl w-[50%] h-[60%] p-6"
                            onSubmit={submitUpdateReview} // เมื่อผู้ใช้กด update ให้เรียกใช้ฟังก์ชันนี้
                        >
                            <h2 className="text-xl text-center font-bold mb-8">Update Your Review</h2>
                            {/* Rating Section */}
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-lg font-medium">Product Quality</p>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`text-2xl ${selectedRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (selectedRating === star) {
                                                    setSelectedRating(selectedRating - 1); // ลบดาวนั้นออก
                                                } else {
                                                    setSelectedRating(star); // เลือกดาวที่คลิก
                                                }
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                className="w-full h-40 p-2 border-2 border-black rounded-2xl mb-6 focus:outline-none focus:ring focus:ring-gray-300"
                                placeholder="Update your review here..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            />

                            <div className="flex justify-between w-full">
                                <button
                                    type="button"
                                    className="px-4 py-1 border-2 border-black rounded-3xl text-sm hover:bg-black hover:text-white transition duration-200"
                                    onClick={() => setUpdateReviewPopup(false)} // ปิด popup
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 bg-black text-white rounded-3xl text-sm hover:opacity-80 transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};
export default TrackOrder;
