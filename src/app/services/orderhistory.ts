import { db } from "../lib/firebase";
import { collection, query, where, getDocs,doc,getDoc, DocumentReference ,documentId} from "firebase/firestore";
import { Order } from "../interfaces/order";
import { CartInterface } from "../interfaces/cartInterface";
import { CartItemsInterface } from "../interfaces/cartItemInterface";
import { Product } from "../interfaces/product";
import { getProductById } from "./getProduct";


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




export const getOrdersByCartId = async (cartIds: string[], statusOrder: string) => {
  try {
    console.log(cartIds , statusOrder);
    const cartsRef = collection(db, "carts");
    // Query orders ที่ cart_id อยู่ใน cartIds
    const ordersRef = collection(db, "orders");
    let ordersSnapshot;
    if (statusOrder=="Completed"){
      const ordersQuery = query(ordersRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))), where("statusOrder", "==","Completed"));
      ordersSnapshot = await getDocs(ordersQuery);
    }
    else{
      const ordersQuery = query(ordersRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))), where("statusOrder", "==", "Processing") || where("statusOrder", "==", "Pending"));
      ordersSnapshot = await getDocs(ordersQuery);
    }
    console.log(ordersSnapshot);

    
    // แปลงผลลัพธ์จาก ordersSnapshot ให้เป็นอาร์เรย์ของ Order
    const orders= Promise.all(ordersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      console.log(data);
    
      const cartRef = data.cart_id;
      const cartSnap = await getDoc(cartRef);
      if (cartSnap) {
        const cartData = cartSnap.data();
        data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
      } else {
        throw new Error("cart not found");
      }

      return {
        id: doc.id,
        orderDate: data.orderDate.toDate(), // แปลง Timestamp ให้เป็นวันที่
        cart_id: data.cart_id,
        total_price: data.total_price || 0,
        statusOrder: data.statusOrder || 'pending',
        payment_id: data.payment_id || null,
      };
    }));

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const getCartItemByCartId = async (
  userId: string
) => {
  try {
    console.log("UserId:", userId);
    const carts = await getCartsByUserId(userId);

    if (carts.length === 0) {
      console.log("No carts found for this user.");
      return [];
    }

    const cartIds = carts.map((cart) => cart.id);
    console.log(cartIds);
    const cartItemsRef = collection(db, "cartItems");
    const cartItemsQuery = query(cartItemsRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    // แปลงผลลัพธ์จาก cartItemsSnapshot ให้เป็นอาร์เรย์ของ cartItem
    const cartItems = Promise.all(cartItemsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      console.log("gggg", data);

      const productRef = data.product_id;
      const productSnap = await getDoc(productRef);
      if (productSnap) {
        const productData = productSnap.data();
        data.product_id = { id: productRef.id, ...productData || {} }; // กำหนดเป็น object ที่มี id
      } else {
        throw new Error("product not found");
      }
      const cartRef = data.cart_id;
      const cartSnap = await getDoc(cartRef);
      if (cartSnap) {
        const cartData = cartSnap.data();
        data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
      } else {
        throw new Error("cart not found");
      }
      const optionItemRef = data.optionitem_id;
      console.log(optionItemRef)
      // const optionItemSnap = await getDoc(optionItemRef);
      if (optionItemRef) {
        const optionItems = await Promise.all(
          optionItemRef.map(async (optionItemRef: any) => {
            const optionItemSnap = await getDoc(optionItemRef);
            if (optionItemSnap) {
              const optionItemData = optionItemSnap.data();
              return { id: optionItemRef.id, ...optionItemData || {} };
            } else {
              throw new Error("optionItem not found");
            }
          })
        );
        data.optionitem_id = optionItems;
        console.log(data.optionitem_id);
      } else {
        throw new Error("optionItem not found");
      }

      return {
        id: doc.id,
        description: data.description, // แปลง Timestamp ให้เป็นวันที่
        quantity: data.quantity,
        pickupdate: data.pickupdate,
        product_id: data.product_id,
        cart_id: data.cart_id,
        optionitem_id: data.optionitem_id,
      };
    }));
    console.log(cartItems)
    return cartItems;

  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const getCartItemByCartIdFromAom = async (cartIds: string[]) => {
  try {
    const cartItemsRef = collection(db, "cartItems");
    const cartItemsQuery = query(cartItemsRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    // แปลงผลลัพธ์จาก cartItemsSnapshot ให้เป็นอาร์เรย์ของ cartItem
    const cartItems = Promise.all(cartItemsSnapshot.docs.map(async (doc) => {
      const data = doc.data();

      const productRef = data.product_id;
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        data.product_id = { id: productRef.id, ...productData || {} }; // กำหนดเป็น object ที่มี id
      } else {
        throw new Error("product not found");
      }
      const cartRef = data.cart_id;
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
      } else {
        throw new Error("cart not found");
      }
      const optionItemRef = data.optionitem_id;
      // const optionItemSnap = await getDoc(optionItemRef);
      if (optionItemRef) {
        const optionItems = await Promise.all(
          optionItemRef.map(async (optionItemRef: any) => {
            const optionItemSnap = await getDoc(optionItemRef);
            if (optionItemSnap) {
              const optionItemData = optionItemSnap.data();
              return { id: optionItemRef.id, ...optionItemData || {} };
            } else {
              throw new Error("optionItem not found");
            }
          })
        );
        data.optionitem_id = optionItems;
      } else {
        throw new Error("optionItem not found");
      }

      return {
        id: doc.id,
        description: data.description, // แปลง Timestamp ให้เป็นวันที่
        quantity: data.quantity,
        pickupdate: data.pickupdate,
        product_id: data.product_id,
        cart_id: data.cart_id,
        optionitem_id: data.optionitem_id,
      };
    }));

    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};



// ฟังก์ชันเพื่อดึงข้อมูล orders โดยใช้ userId
export const getOrdersByUserId = async (userId: string) => {
  try {
    console.log("UserId:", userId)
    // ดึง carts ที่เชื่อมโยงกับ userId
    const carts = await getCartsByUserId(userId);
    console.log("carts55:", carts)

    if (carts.length === 0) {
      console.log("No carts found for this user.");
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const cartIds = carts.map((cart) => cart.id);

    console.log("cartsId:", cartIds)

    const orders = await getOrdersByCartId(cartIds, "Not Completed");
    // const cartItems = await getCartItemByCartId(cartIds);
    // Query เพื่อดึง orders ที่ตรงกับ cart_id
    // ใช้ `in` เพื่อดึงข้อมูลหลาย `cart_id`
    console.log("test ",orders)


    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
export const getCompletedOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    console.log("UserId:", userId)
    // ดึง carts ที่เชื่อมโยงกับ userId
    const carts = await getCartsByUserId(userId);
    console.log("carts55:", carts)

    if (carts.length === 0) {
      console.log("No carts found for this user.");
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const cartIds = carts.map((cart) => cart.id);

    console.log("cartsId:", cartIds)

    const orders = await getOrdersByCartId(cartIds, "Completed");

    console.log("orderscomplete:", orders)

    
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};