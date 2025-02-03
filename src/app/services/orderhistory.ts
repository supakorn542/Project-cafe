import { db } from "../lib/firebase";
import { collection, query, where, getDocs,doc,getDoc, DocumentReference ,documentId} from "firebase/firestore";
import { Order } from "../interfaces/order";
import { CartInterface } from "../interfaces/cartInterface";



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
    ;
    return [];
  }
};




export const getOrdersByCartId = async (cartIds: string[], statusOrder: string) => {
  try {
    ;
    const ordersRef = collection(db, "orders");
    let ordersSnapshot;
    
    // ใช้ query เฉพาะเมื่อ statusOrder เป็น "Completed"
    if (statusOrder == "Completed" || statusOrder == "Received") {
      const ordersQuery = query(
        ordersRef, 
        where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))), 
        where("statusOrder", "in", ["Completed", "Received"]),
      );
      ordersSnapshot = await getDocs(ordersQuery);
    }
    // สำหรับกรณีที่ statusOrder เป็น "Processing" หรือ "Pending"
    else {
      const ordersQuery = query(
        ordersRef, 
        where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))), 
        where("statusOrder", "in", ["Processing", "Pending"])  // ใช้ 'in' แทน '||'
      );
      ordersSnapshot = await getDocs(ordersQuery);
    }
    ;

    // แปลงผลลัพธ์จาก ordersSnapshot ให้เป็นอาร์เรย์ของ Order
    const orders = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      ;
    
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
    ;
    return [];
  }
};



export const getCartItemByCartId = async (
  userId: string
) => {
  try {
    ;
    const carts = await getCartsByUserId(userId);

    if (carts.length === 0) {
      ;
      return [];
    }

    const cartIds = carts.map((cart) => cart.id);
    ;
    const cartItemsRef = collection(db, "cartItems");
    const cartItemsQuery = query(cartItemsRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    // แปลงผลลัพธ์จาก cartItemsSnapshot ให้เป็นอาร์เรย์ของ cartItem
    const cartItems = Promise.all(cartItemsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      ;

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
        ;
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
    ;
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
    ;
    return [];
  }
};



// ฟังก์ชันเพื่อดึงข้อมูล orders โดยใช้ userId
export const getOrdersByUserId = async (userId: string) => {
  try {
    
    // ดึง carts ที่เชื่อมโยงกับ userId
    const carts = await getCartsByUserId(userId);
    

    if (carts.length === 0) {
      ;
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const cartIds = carts.map((cart) => cart.id);

    

    const orders = await getOrdersByCartId(cartIds, "Not Completed");
    // const cartItems = await getCartItemByCartId(cartIds);
    // Query เพื่อดึง orders ที่ตรงกับ cart_id
    // ใช้ `in` เพื่อดึงข้อมูลหลาย `cart_id`
    


    return orders;
  } catch (error) {
    ;
    return [];
  }
};
export const getCompletedOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    
    // ดึง carts ที่เชื่อมโยงกับ userId
    const carts = await getCartsByUserId(userId);
    

    if (carts.length === 0) {
      ;
      return [];
    }
    
    const ordersRef = collection(db, "orders");
    const cartIds = carts.map((cart) => cart.id);

    

    const orders = await getOrdersByCartId(cartIds, "Completed");

    

    
    return orders;
  } catch (error) {
    ;
    return [];
  }
};