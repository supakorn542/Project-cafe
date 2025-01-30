import { collection, doc, addDoc, where, getDocs, query, getDoc, deleteDoc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DailySales } from '../interfaces/dailySales';



export const getTodayOrders = async () => {
    try {
        const ordersRef = collection(db, "orders");

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
        const endOfDayTimestamp = Timestamp.fromDate(endOfDay);

        const ordersQuery = query(
            ordersRef,
            where("orderDate", ">=", startOfDayTimestamp),
            where("orderDate", "<=", endOfDayTimestamp),
            where("statusOrder", "==", "Completed")
        );

        const querySnapshot = await getDocs(ordersQuery); // ดึงข้อมูลจาก Firestore

        if (querySnapshot.empty) {
            console.log("No orders found for today.");
            return [];
        }

        const orderss = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched orders:", orderss);


        const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();

            const cartRef = orderData.cart_id;
            const cartSnap = await getDoc(cartRef);
            if (cartSnap.exists()) {
                const cartData = cartSnap.data();
                orderData.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id

                console.log(orderData.cart_id.status)
                if (orderData.cart_id.status == false) {
                    return orderData
                } else {
                    return null
                }
            } else {
                throw new Error("cart not found");
            }
        }));

        console.log("mami", orders)
        return orders.filter(order => order !== null);
    } catch (error) {
        console.error("Error fetching today's orders with products:", error);
        return [];
    }
};

export const getTodayOnlineSales = async () => {
    try {
        const ordersRef = collection(db, "orders");

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
        const endOfDayTimestamp = Timestamp.fromDate(endOfDay);

        // ดึงข้อมูล orders ที่อยู่ในวันเดียวกับวันนี้ และมีสถานะ "Completed"
        const ordersQuery = query(
            ordersRef,
            where("orderDate", ">=", startOfDayTimestamp),
            where("orderDate", "<=", endOfDayTimestamp)
        );

        const querySnapshot = await getDocs(ordersQuery); // ดึงข้อมูลจาก Firestore

        if (querySnapshot.empty) {
            console.log("No orders found for today.");
            return 0; // คืนค่า 0 ถ้าไม่มีคำสั่งซื้อ
        }

        // คำนวณยอดรวมจาก total_price ของทุกคำสั่งซื้อที่ดึงมา
        const totalSales = querySnapshot.docs.reduce((sum, doc) => {
            const orderData = doc.data();
            return sum + (orderData.total_price || 0); // ใช้ค่า total_price หากมีค่า ไม่งั้นให้ใช้ 0
        }, 0);

        console.log("Total sales for today:", totalSales);
        return totalSales;

    } catch (error) {
        console.error("Error fetching today's sales:", error);
        return 0; // คืนค่า 0 หากเกิดข้อผิดพลาด
    }
};

export const getTodayInStoreSales = async () => { 
    try {
      const dailySalesRef = collection(db, "dailySales");
  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
      const endOfDayTimestamp = Timestamp.fromDate(endOfDay);
  
      const dailySalesQuery = query(
        dailySalesRef,
        where("salesDate", ">=", startOfDayTimestamp),
        where("salesDate", "<=", endOfDayTimestamp)
      );
  
      const querySnapshot = await getDocs(dailySalesQuery); // ดึงข้อมูลจาก Firestore
  
      if (querySnapshot.empty) {
        console.log("No sales found for today.");
        return 0; // หากไม่พบข้อมูลจะส่งกลับ 0
      }
  
      // ดึง totalSales จากแต่ละ document และหาผลรวม
      const totalSales = querySnapshot.docs.reduce((acc, doc) => {
        const salesData = doc.data();
        if (salesData.totalSales) {
          return acc + salesData.totalSales;
        }
        return acc;
      }, 0);
  
      console.log("Total sales for today:", totalSales);
      return totalSales;
    } catch (error) {
      console.error("Error fetching today's sales:", error);
      return 0; // หากเกิดข้อผิดพลาดจะส่งกลับ 0
    }
  };
  


export const createDailySales = async (sales: DailySales): Promise<void> => {
    try {
        const SalesCollection = collection(db, 'dailySales');
        await addDoc(SalesCollection, {
            salesDate: sales.salesDate,
            totalSales: sales.totalSales,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Failed to create review");
    }
};
