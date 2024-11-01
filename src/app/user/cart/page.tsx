"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // ปรับเส้นทางตามที่คุณใช้
import { collection, query, where, getDocs,doc } from "firebase/firestore";
import { CartInterface } from "@/app/interfaces/cartInterface"; // นำเข้า CartInterface

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "1zldI2JIVAoidX8LmSet";
  
  
  useEffect(() => {
    const fetchCartItems = async () => {
        try {
          const userRef = doc(db, "user", userId);
      
          const q = query(
            collection(db, "cart"),
            where("user_id", "==", userRef)
          );
      
          const cartSnapshot = await getDocs(q);
          const items = cartSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              product_id: data.product_id.map((product: any) => ({
                id: product.id, // ID ของสินค้า
                name: product.name, // ชื่อของสินค้า
                price: product.price, // ราคาของสินค้า
              })), // แปลงข้อมูลเป็น array ของ Product
              quantity: data.quantity,
              total_price: data.total_price,
              user_id: data.user_id,
            };
          });
          setCartItems(items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };
      
    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.total_price, 0);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id}>
          
              Quantity: {item.quantity} <br />
              Total Price: {item.total_price} <br />
            
            </li>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </ul>
      <h2>Total Price: {totalPrice}</h2>
    </div>
  );
};

export default Cart;
