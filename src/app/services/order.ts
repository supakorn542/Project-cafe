import { collection, query, where, getDocs, doc, getDoc, DocumentReference, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../interfaces/order';

export const getOrders = async () => {
  const orderCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(orderCol);

  const orders = await Promise.all(orderSnapshot.docs.map(async (docSnapshot) => {
    const data = docSnapshot.data();

    data.id = docSnapshot.id

    const paymentRef = data.payment_id;
    const paymentSnap = await getDoc(paymentRef);
    if (paymentSnap.exists()) {
      const paymentData = paymentSnap.data() as { status: string }; // ระบุ type ของ paymentData
      if (paymentData.status === "Pending" || paymentData.status === "Uncompleted") {
        data.payment_id = { id: paymentRef.id, ...paymentData || {} };

        const cartRef = data.cart_id;
        const cartSnap = await getDoc(cartRef);
        if (cartSnap.exists()) {
          const cartData = cartSnap.data();
          data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
        } else {
          throw new Error("cart not found");
        }

        const userRef = data.cart_id.user_id;
        console.log(userRef)
        const userSnap = await getDoc(userRef);
        if (userSnap) {
          const userData = userSnap.data();
          data.cart_id.user_id = { id: userRef.id, ...userData || {} }; // กำหนดเป็น object ที่มี id
        } else {
          throw new Error("user not found");
        }
      } else {
        // ถ้า status ไม่ใช่ "Pending" ให้ return null
        return null;
      }
    } else {
      throw new Error("payment not found");
    }



    return data
  })
  )

  // กรองคำสั่งซื้อที่มีสถานะเป็น "Pending" หรือ "Uncompleted"
  const orderPending = orders.filter(order => order != null);

  // เรียงลำดับโดยให้ "Pending" อยู่ข้างบน และเรียงตาม orderDate จากปัจจุบัน -> อดีต
  orderPending.sort((a, b) => {
    // ให้ "Pending" อยู่ข้างบน
    if (a.payment_id.status === "Pending" && b.payment_id.status !== "Pending") {
      return -1; // a อยู่ข้างบน
    }
    if (a.payment_id.status !== "Pending" && b.payment_id.status === "Pending") {
      return 1; // b อยู่ข้างบน
    }

    // ถ้าสถานะเท่ากัน ให้เรียงตาม orderDate จากใหม่ -> เก่า
    const aDate = a.orderDate?.toMillis ? a.orderDate.toMillis() : a.orderDate.getTime();
    const bDate = b.orderDate?.toMillis ? b.orderDate.toMillis() : b.orderDate.getTime();
    return bDate - aDate; // เรียงจากใหม่ -> เก่า
  });

  return orderPending

}

export const getProcessOrders = async () => {
  const orderCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(orderCol);

  const orders = await Promise.all(orderSnapshot.docs.map(async (docSnapshot) => {
    const data = docSnapshot.data();

    data.id = docSnapshot.id

    if (data.statusOrder !== "Completed" && data.statusOrder !== "Received") {
      const paymentRef = data.payment_id;
      const paymentSnap = await getDoc(paymentRef);
      if (paymentSnap.exists()) {
        const paymentData = paymentSnap.data() as { status: string }; // ระบุ type ของ paymentData
        if (paymentData.status === "Completed") {
          data.payment_id = { id: paymentRef.id, ...paymentData || {} };
  
          const cartRef = data.cart_id;
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
          } else {
            throw new Error("cart not found");
          }
  
          const userRef = data.cart_id.user_id;
          console.log(userRef)
          const userSnap = await getDoc(userRef);
          if (userSnap) {
            const userData = userSnap.data();
            data.cart_id.user_id = { id: userRef.id, ...userData || {} }; // กำหนดเป็น object ที่มี id
          } else {
            throw new Error("user not found");
          }
        } else {
          // ถ้า status ไม่ใช่ "Pending" ให้ return null
          return null;
        }
      } else {
        throw new Error("payment not found");
      }
    }else{
      return null
    }
    
    return data
  })
  )
  const orderPending = orders.filter(order => order != null)
  orderPending.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());

  return orderPending

}

export const getFinishOrders = async () => {
  const orderCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(orderCol);

  const orders = await Promise.all(orderSnapshot.docs.map(async (docSnapshot) => {
    const data = docSnapshot.data();

    data.id = docSnapshot.id

    if (data.statusOrder=="Completed" || data.statusOrder=="Received"){
      const paymentRef = data.payment_id;
      const paymentSnap = await getDoc(paymentRef);
      if (paymentSnap.exists()) {
        const paymentData = paymentSnap.data() as { status: string }; // ระบุ type ของ paymentData
        if (paymentData.status === "Completed") {
          data.payment_id = { id: paymentRef.id, ...paymentData || {} };

          const cartRef = data.cart_id;
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            data.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id
          } else {
            throw new Error("cart not found");
          }

          const userRef = data.cart_id.user_id;
          console.log(userRef)
          const userSnap = await getDoc(userRef);
          if (userSnap) {
            const userData = userSnap.data();
            data.cart_id.user_id = { id: userRef.id, ...userData || {} }; // กำหนดเป็น object ที่มี id
          } else {
            throw new Error("user not found");
          }
      } else {
        // ถ้า status ไม่ใช่ "Pending" ให้ return null
        return null;
      }
    } else {
      throw new Error("payment not found");
    }
    }else{
      return null
    }
    

    return data
  })
  )
  // const orderPending = orders.filter(order => order != null)
  // orderPending.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());

  // กรองคำสั่งซื้อที่มีสถานะเป็น "Pending" หรือ "Uncompleted"
  const orderCompleted = orders.filter(order => order != null);

  // เรียงลำดับโดยให้ "Completed" อยู่ข้างบน และเรียงตาม orderDate จากปัจจุบัน -> อดีต
  orderCompleted.sort((a, b) => {
    // ให้ "Pending" อยู่ข้างบน
    if (a.statusOrder === "Completed" && b.statusOrder !== "Completed") {
      return -1; // a อยู่ข้างบน
    }
    if (a.statusOrder !== "Completed" && b.statusOrder === "Completed") {
      return 1; // b อยู่ข้างบน
    }

    // ถ้าสถานะเท่ากัน ให้เรียงตาม orderDate จากใหม่ -> เก่า
    const aDate = a.orderDate?.toMillis ? a.orderDate.toMillis() : a.orderDate.getTime();
    const bDate = b.orderDate?.toMillis ? b.orderDate.toMillis() : b.orderDate.getTime();
    return bDate - aDate; // เรียงจากใหม่ -> เก่า
  });

  return orderCompleted

}


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

// ฟังก์ชันเพื่ออัปเดตข้อมูลสต็อก
export const updateStatusOrderByID = async (
  orderId: string,
  updatedStatusPayment: string,  // ข้อมูลที่ได้รับจากแบบฟอร์ม

) => {
  try {
    // ตรวจสอบว่า Stock ที่ระบุมีอยู่ในฐานข้อมูลหรือไม่
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return { success: false, message: "order not found" };
    }

    // อัปเดตข้อมูล order
    if (Object.keys(updatedStatusPayment).length > 0) {
      await updateDoc(orderRef, { statusOrder: updatedStatusPayment });
    }

    return { success: true, message: "Stock updated and details added successfully" };
  } catch (error) {
    console.error("Error updating stock and adding details:", error);
    return { success: false, message: "Failed to update stock or add details", error };
  }
};

export const updateStatusPaymentByID = async (
  orderId: string,
  updatedStatusPayment: string,  // ข้อมูลที่ได้รับจากแบบฟอร์ม

) => {
  try {
    // ตรวจสอบว่า Stock ที่ระบุมีอยู่ในฐานข้อมูลหรือไม่
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return { success: false, message: "order not found" };
    }
    else {
      const data = orderSnapshot.data()
      console.log(data)

      const paymentRef = data.payment_id;
      let payment_id = '';

      if (paymentRef) {
        const paymentDoc = await getDoc(paymentRef);
        payment_id = paymentDoc.id; // ดึง ID จาก reference

        const paymentRefs = doc(db, "payments", payment_id);
        const paymentSnapshot = await getDoc(paymentRefs);

        //  อัปเดตข้อมูล order
        if (Object.keys(updatedStatusPayment).length > 0) {
          await updateDoc(paymentRefs, { status: updatedStatusPayment });
        }
      }

    }
    return { success: true, message: "Stock updated and details added successfully" };
  } catch (error) {
    console.error("Error updating stock and adding details:", error);
    return { success: false, message: "Failed to update stock or add details", error };
  }
};