"use client";

import { Key, useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // ปรับเส้นทางตามที่คุณใช้
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { CartInterface } from "@/app/interfaces/cartInterface"; // นำเข้า CartInterface
import { Timestamp } from "firebase/firestore";
import { Product } from "@/app/interfaces/product";
import { OptionItem } from "@/app/interfaces/optionItemInterface";
import Navbar from "@/app/components/Navbar";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import EditCartPopup from "@/app/components/orderProduct/editCartPopup";
import Image from "next/image";
import { useAuth } from "@/app/context/authContext";
import Payment from "@/app/components/payment popup/payment";
import FooterUser from "@/app/components/footer/footerUser";
const timestampToString = (timestamp: Timestamp) => {
  const date = timestamp.toDate(); // แปลง Timestamp เป็น Date
  return date.toLocaleString(); // แปลง Date เป็นข้อความที่อ่านง่าย
};

interface CartStateItem extends CartInterface {
  quantity: number;
  product_id: Product[];
  optionItems_id: OptionItem[];
  totalPrice: number;
}

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartStateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId ,setCartId] = useState(String || "")
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupPaymentOpen, setIsPopupPaymentOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleOpenPopup = (itemId: string) => {
    setIsPopupOpen(true);
    setEditingItemId(itemId);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsPopupPaymentOpen(false);
    setEditingItemId(null);
  };

  const handleSubmit = (formData: any) => {
    // Handle form submission (e.g., send data to server)
    console.log("Form Data:", formData);
    handleClosePopup();
  };
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user && user.id) {
        // ดึงข้อมูลจาก Firestore
        console.log("User are login", user);
        try {
          setLoading(true);

          // 1. ดึงข้อมูล cart ที่ user_id == userRef และ status == true
          const userRef = doc(db, "users", user.id);
          const cartQuery = query(
            collection(db, "carts"),
            where("user_id", "==", userRef),
            where("status", "==", true)
          );

         
          const cartSnapshot = await getDocs(cartQuery);
        
          const cartIds = cartSnapshot.docs.map((doc) => doc.id);
          // ถ้าไม่มี cart ให้หยุดการทำงานและตั้งค่า state เป็นว่าง
          console.log("cartIds :", cartIds);
          setCartId(cartIds[0])

          if (cartIds.length === 0) {
            setCartItems([]);
            return;
          }

          const cartRefIds = cartIds.map((cartId) => doc(db, "carts", cartId));
          console.log("cartRefIds :", cartRefIds);
          // 2. ดึงข้อมูล cartItems ที่ cart_id ตรงกับ cartIds
          const cartItemQuery = query(
            collection(db, "cartItems"),
            where("cart_id", "in", cartRefIds)
          );
          console.log("cartitem", cartItemQuery);

          const cartItemSnapshot = await getDocs(cartItemQuery);
          console.log("cartItemSnapshot", cartItemSnapshot);
          const cartItems = cartItemSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              product_id: data.product_id,
              quantity: data.quantity,
              optionitem_ids: data.optionitem_id || [], // array ของ optionitem_id
              cart_id: data.cart_id,
            };
          });
          console.log("dd", cartItems);

          // 3. ดึงข้อมูลสินค้าจาก collection "products"
          const productSnapshots = await Promise.all(
            cartItems.map((item) => getDoc(item.product_id))
          );

          const products = productSnapshots.reduce(
            (acc: Record<string, any>, snapshot) => {
              if (snapshot.exists()) {
                acc[snapshot.id] = snapshot.data();
              }
              return acc;
            },
            {}
          );

          // 4. ดึงข้อมูล optionItems ที่เกี่ยวข้อง
          const optionItemSnapshots = await Promise.all(
            cartItems.flatMap((item) => {
              // ตรวจสอบว่า item.optionitem_ids เป็น array ของ DocumentReference
              if (Array.isArray(item.optionitem_ids)) {
                return item.optionitem_ids.map((optionRef) => {
                  // ใช้ getDoc เพื่อดึงข้อมูลจาก DocumentReference
                  return getDoc(optionRef); // optionRef เป็น DocumentReference
                });
              } else {
                console.error(
                  "optionitem_ids is not an array or is missing",
                  item.optionitem_ids
                );
                return []; // คืนค่า empty array ถ้าไม่ใช่ array ของ DocumentReference
              }
            })
          );

          // รอให้ Promise ทั้งหมดเสร็จสิ้น
          const resolvedOptionItems = await Promise.all(optionItemSnapshots);

          const optionItems = resolvedOptionItems.reduce(
            (acc: Record<string, any>, snapshot) => {
              if (snapshot.exists()) {
                acc[snapshot.id] = snapshot.data();
              }
              return acc;
            },
            {}
          );

          console.log("optionItems: ", optionItems);

          // 5. อัปเดต cartItems พร้อมข้อมูลสินค้าและ optionItems
          const updatedCartItems = cartItems.map((item) => {
            let productDetails: {
              id: string;
              name: string;
              price: number;
              imageProduct: string;
            }[] = [];

            if (Array.isArray(item.product_id)) {
              // กรณี product_id เป็น array
              productDetails = item.product_id.map((productRef) => {
                if (productRef instanceof DocumentReference) {
                  const productId = productRef.id;
                  const product = products[productId] || {};
                  return {
                    id: productId,
                    name: product.name || "Unknown",
                    price: product.price || 0,
                    imageProduct: product.imageProduct || "",
                  };
                }
                console.warn("Invalid product_id format in array:", productRef);
                return { id: "", name: "Unknown", price: 0, imageProduct: "" }; // default object
              });
            } else if (item.product_id instanceof DocumentReference) {
              // กรณี product_id เป็น DocumentReference เดี่ยว
              const productId = item.product_id.id;
              const product = products[productId] || {};
              productDetails = [
                {
                  id: productId,
                  name: product.name || "Unknown",
                  price: product.price || 0,
                  imageProduct: product.imageProduct || "",
                },
              ];
            } else {
              console.warn("Invalid product_id format:", item.product_id);
            }

            let optionItemsForItem: any[] = [];

            if (Array.isArray(item.optionitem_ids)) {
              // ดึงข้อมูล optionItems ที่เชื่อมโยงกับแต่ละ cartItem
              optionItemsForItem = item.optionitem_ids.map(
                (optionRef: { id: any }) => {
                  const optionId = optionRef.id;
                  return optionItems[optionId] || {}; // เชื่อมโยงข้อมูล optionItem
                }
              );
            }

            return {
              id: item.id,
              product_id: productDetails,
              optionItems_id: optionItemsForItem || null,
              status: true,
              totalPrice: productDetails.reduce(
                (sum: number, product: { price: number }) =>
                  sum + product.price * (item.quantity || 1),
                0
              ),
              quantity: item.quantity,

              user_id:
                cartSnapshot.docs.find((doc) => doc.id === item.cart_id)?.data()
                  .user_id || "Unknown",
            } as unknown as CartStateItem;
          });

          // 6. อัปเดต State
          setCartItems(updatedCartItems);
          
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // รอให้ข้อมูลผู้ใช้ถูกโหลด
        console.log("User not logged in or user ID not found.");
        return; // หรือสามารถใช้การแสดงข้อความหรือการเปลี่ยนเส้นทางไปยังหน้า login
      }
    };
    fetchCartItems();
  }, [user, isPopupOpen]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-beige min-h-screen pt-16">
      <Navbar />
      <div className="container mx-auto px-4 py-8 ">
        <div className="flex gap-8">
          {/* Left Section: Cart Items */}
          <div className="flex-1">
            <header className=" text-greenthemewep p-4 ">
              <h1 className="text-3xl font-bold">Your Cart</h1>
            </header>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b pb-4 mb-4 gap-4"
              >
                <div className="flex-1">
                  {item.product_id.map((product: Product) => (
                    <div key={product.id}>
                      {product.name}
                      {product.imageProduct && (
                        <Image
                          src={product.imageProduct}
                          alt={product.name}
                          width={200} // Add width
                          height={150} // Add height (optional)
                          className="w-24 h-24 rounded-lg"
                        />
                      )}{" "}
                    </div>
                  ))}

                  {item.optionItems_id.map((option: OptionItem) => (
                    <p key={option.id}>{option.name} </p>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-2 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="p-2 bg-gray-200 rounded">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${item.totalPrice}</p>
                  <button className="text-red-500 mt-2">
                    <MdDeleteOutline />
                  </button>
                  <button
                    className="text-red-500 mt-2"
                    onClick={() => handleOpenPopup(item.id)}
                  >
                    <CiEdit />
                  </button>
                  {isPopupOpen && (
                    <EditCartPopup
                      cartItemId={item.id}
                      onClose={handleClosePopup}
                      onSubmit={handleSubmit}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Section: Total Price */}
          <div className="w-1/3 bg-greenthemewep p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Total</h2>
            {cartItems.map((item) => (
              <div key={item.id} className=" text-sm  py-2 text-white">
                
                {item.product_id.map((product: Product) => (
                  <div key={product.id} className="flex justify-between ">
                    <span>{product.name}</span>
                    <span>{product.price}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between text-white text-lg font-bold border-t py-2 mt-2">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
            <button onClick={() => setIsPopupPaymentOpen(true)} className="mt-4 w-full bg-green-800 text-white py-2 rounded">
              Proceed to Checkout
            </button>
            {isPopupPaymentOpen && (
                  <Payment cartId={cartId} onClose={handleClosePopup} data-aos="fade-up" />
                )}
          </div>
        </div>
      </div>
        <FooterUser />
    </div>
  );
};

export default Cart;
