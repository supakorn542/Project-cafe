import { db } from "../lib/firebase";
import { collection, query, where, getDocs,doc,getDoc } from "firebase/firestore";
import { Order } from "../interfaces/order";
import { CartInterface } from "../interfaces/cartInterface";
import { CartItemsInterface } from "../interfaces/cartItemInterface";


export const getCartsByUserId = async (userId: string): Promise<CartInterface[]> => {
  try {
    
    const cartsRef = collection(db, "carts");

    // สร้าง DocumentReference สำหรับ user_id
    const userRef = doc(db, "users", userId);  // Assume `userId` is the document ID in the "users" collection

    // ใช้ DocumentReference ใน query
    const q = query(cartsRef, where("user_id", "==", userRef), where("status","==",false));
    const querySnapshot = await getDocs(q);

    const carts: CartInterface[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // แปลงข้อมูลให้ตรงกับ CartInterface ใหม่
      return {
        id: doc.id,
        status: data.status || false,  // กำหนดค่า default สำหรับ status
        user_id: data.user_id || '',   // กำหนดค่า default สำหรับ user_id
      };
    });

    return carts;
  } catch (error) {
    console.error("Error fetching carts:", error);
    return [];
  }
};


export const getOrdersByCartId = async (cartIds: string[]): Promise<Order[]> => {
  try {
    const cartsRef = collection(db, "carts");

    // Query orders ที่ cart_id อยู่ใน cartIds
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(ordersRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
    const ordersSnapshot = await getDocs(ordersQuery);

    // แปลงผลลัพธ์จาก ordersSnapshot ให้เป็นอาร์เรย์ของ Order
    const orders: Order[] = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderDate: data.orderDate.toDate(), // แปลง Timestamp ให้เป็นวันที่
        cart_id: data.cart_id || '',
        total_price: data.total_price || 0,
        statusOrder: data.statusOrder || 'pending',
        payment_id: data.payment_id || null,
      };
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};



// ฟังก์ชันเพื่อดึงข้อมูล orders โดยใช้ userId
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    console.log("UserId:", userId)
    // ดึง carts ที่เชื่อมโยงกับ userId
    const carts = await getCartsByUserId(userId);
    console.log("carts:", carts)

    if (carts.length === 0) {
      console.log("No carts found for this user.");
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const cartIds = carts.map((cart) => cart.id);

    console.log("cartsId:", cartIds)

    const orders = await getOrdersByCartId(cartIds);
    // Query เพื่อดึง orders ที่ตรงกับ cart_id
    // ใช้ `in` เพื่อดึงข้อมูลหลาย `cart_id`

    

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};