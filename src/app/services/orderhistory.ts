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


export const getOrdersByCartId = async (cartIds: string[], statusOrder: string): Promise<Order[]> => {
  try {
    const cartsRef = collection(db, "carts");
    // Query orders ที่ cart_id อยู่ใน cartIds
    const ordersRef = collection(db, "orders");
    let ordersSnapshot;
    if (statusOrder=="Completed"){
      const ordersQuery = query(ordersRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))), where("statusOrder", "==","Completed"));
      ordersSnapshot = await getDocs(ordersQuery);
    }
    else{
      const ordersQuery = query(ordersRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
      ordersSnapshot = await getDocs(ordersQuery);
    }
    
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

export const getCartItemByCartId = async (
  userId: string
): Promise<(CartItemsInterface & { productDetails?: { id: string; name: string; price: number; imageProduct: string } })[]> => {
  try {
    console.log("UserId:", userId);
    const carts = await getCartsByUserId(userId);

    if (carts.length === 0) {
      console.log("No carts found for this user.");
      return [];
    }

    const cartIds = carts.map((cart) => cart.id);
    console.log(cartIds);

    // ดึง cartItems จาก Firestore
    const cartItemsRef = collection(db, "cartItems");
    const cartItemsQuery = query(cartItemsRef, where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id))));
    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    const cartItems: CartItemsInterface[] = cartItemsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        cart_id: data.cart_id, // product_id เป็น DocumentReference
        product_id: data.product_id, // product_id เป็น DocumentReference
        quantity: data.quantity || 0,
        optionitem_ids: data.optionitem_ids || [],
        pickupdate: data.pickupdate?.toDate() || new Date(),
        description: data.description || "",
      };
    });

    const productIds = cartItems.map((item: any) => {
      if (typeof item.product_id !== "string" && item.product_id instanceof DocumentReference) {
        const pathSegments = item.product_id.path.split("/");
        return pathSegments[pathSegments.length - 1]; // ดึง ID ส่วนสุดท้ายของ path
      }
      return null; // หาก product_id เป็น string หรือไม่มี path
    });
    console.log("================================", productIds)
    
    const productData = await Promise.all(
      productIds.map(async (i) => {
        const productRef = doc(db, "products", i);
        const docSnap = await getDoc(productRef);
        if (docSnap.exists()) {
          return { id: i, data: docSnap.data() }; // ดึงข้อมูลจาก Firestore
        } else {
          console.log(`Document with ID ${i} does not exist.`);
          return null; // คืนค่า null หากเอกสารไม่มี
        }
      })
    );

    console.log("djeihiwjdiw", productData)
    console.log("test2", cartItems)

    // รวม productDetails เข้ากับ cartItems
    const result = cartItems.map((item, index) => {
      const productDetails =
        item.product_id
          ? (() => {
              const productId = item.product_id;
              const product = productData[index]; 
              console.log(productId)
              console.log(product)
              return {
                id: productId,
                name: product!.data.name || "Unknown",
                price: product!.data.price,
                imageProduct: product!.data.imageProduct,
              };
            })()
          : undefined;

      return {
        ...item,
        productDetails,
      };
    });

    console.log("productDetails:", result);
    return result;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};




// ฟังก์ชันเพื่อดึงข้อมูล orders โดยใช้ userId
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
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

    const orders = await getOrdersByCartId(cartIds, "");
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
    // const cartItems = await getCartItemByCartId(cartIds);
    // Query เพื่อดึง orders ที่ตรงกับ cart_id
    // ใช้ `in` เพื่อดึงข้อมูลหลาย `cart_id`

    

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};