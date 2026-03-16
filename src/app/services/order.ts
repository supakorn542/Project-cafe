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
          data.cart_id = { id: cartRef.id, ...cartData || {} }; 
        } else {
          throw new Error("cart not found");
        }

        const userRef = data.cart_id.user_id;
        
        const userSnap = await getDoc(userRef);
        if (userSnap) {
          const userData = userSnap.data();
          data.cart_id.user_id = { id: userRef.id, ...userData || {} };
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
        const paymentData = paymentSnap.data() as { status: string };
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

export const getCartItemByCartIdFromOrder = async (cartIds: string[]) => {
  try {
    const cartItemsRef = collection(db, "cartItems");

    const cartItemsQuery = query(
      cartItemsRef,
      where("cart_id", "in", cartIds.map((id) => doc(db, "carts", id)))
    );

    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    const cartItems = await Promise.all(
      cartItemsSnapshot.docs.map(async (docSnap) => {
        try {
          const data = docSnap.data();

          // ---------------- product ----------------
          const productRef = data.product_id;
          if (!productRef) {
            throw new Error("productRef is null");
          }

          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            throw new Error("product not found");
          }

          const productData = productSnap.data();
          data.product_id = {
            id: productRef.id,
            ...productData || {},
          };

          // ---------------- cart ----------------
          const cartRef = data.cart_id;
          const cartSnap = await getDoc(cartRef);

          if (!cartSnap.exists()) {
            throw new Error("cart not found");
          }

          const cartData = cartSnap.data();
          data.cart_id = {
            id: cartRef.id,
            ...cartData || {},
          };

          // ---------------- option items ----------------
          const optionItemRef = data.optionitem_id;

          if (optionItemRef && Array.isArray(optionItemRef)) {
            const optionItems = await Promise.all(
              optionItemRef.map(async (optionRef: any) => {
                const optionItemSnap = await getDoc(optionRef);

                if (!optionItemSnap.exists()) {
                  throw new Error("optionItem not found");
                }

                const optionItemData = optionItemSnap.data();

                return {
                  id: optionRef.id,
                  ...optionItemData || {},
                };
              })
            );

            data.optionitem_id = optionItems;
          } else {
            data.optionitem_id = [];
          }

          return {
            id: docSnap.id,
            description: data.description,
            quantity: data.quantity,
            pickupdate: data.pickupdate,
            product_id: data.product_id,
            cart_id: data.cart_id,
            optionitem_id: data.optionitem_id,
          };

        } catch (err) {
          return null;
        }
      })
    );

    return cartItems.filter(Boolean); // ลบ null ออก
  } catch (error) {
    return [];
  }
};


export const updateStatusOrderByID = async (
  orderId: string,
  updatedStatusPayment: string, 

) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return { success: false, message: "order not found" };
    }

    // อัปเดตข้อมูล order
    if (Object.keys(updatedStatusPayment).length > 0) {
      await updateDoc(orderRef, { statusOrder: updatedStatusPayment });
    }

    return { success: true, message: "Status order updated successfully" };
  } catch (error) {
    ;
    return { success: false, message: "Failed to update status order", error };
  }
};

export const updateStatusPaymentByID = async (
  orderId: string,
  updatedStatusPayment: string,  

) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return { success: false, message: "order not found" };
    }
    else {
      const data = orderSnapshot.data()
      

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
    return { success: true, message: "Status payment updated successfully" };
  } catch (error) {
    ;
    return { success: false, message: "Failed to update status payment", error };
  }
};