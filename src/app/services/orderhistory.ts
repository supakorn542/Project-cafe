import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// สร้างฟังก์ชันสำหรับดึงข้อมูล
export const getPaidOrdersWithCartItems = async () => {
  try {
    const db = getFirestore();

    // Step 1: ดึงข้อมูลจากตาราง `order` ที่ payment = 'paid'
    const ordersRef = collection(db, "order");
    const ordersQuery = query(ordersRef, where("payment", "==", "paid"));
    const ordersSnapshot = await getDocs(ordersQuery);

    const ordersWithCartItems = [];

    // Step 2: ดึง `cart_id` จากแต่ละ order และตรวจสอบ `cart` ที่ status = false
    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data();
      const cartId = orderData.cart_id;

      if (cartId) {
        const cartRef = collection(db, "cart");
        const cartQuery = query(cartRef, where("cart_id", "==", cartId), where("status", "==", false));
        const cartSnapshot = await getDocs(cartQuery);

        if (!cartSnapshot.empty) {
          // Step 3: ดึงข้อมูล `cartItems` ที่เชื่อมโยงกับ `cart_id`
          const cartItemsRef = collection(db, "cartItems");
          const cartItemsQuery = query(cartItemsRef, where("cart_id", "==", cartId));
          const cartItemsSnapshot = await getDocs(cartItemsQuery);

          const cartItems = cartItemsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // รวมข้อมูล order และ cartItems
          ordersWithCartItems.push({
            orderId: orderDoc.id,
            ...orderData,
            cartItems,
          });
        }
      }
    }

    return ordersWithCartItems;
  } catch (error) {
    console.error("Error fetching orders with cart items:", error);
    throw error;
  }
};
