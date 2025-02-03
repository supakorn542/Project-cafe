import { collection, addDoc, where, getDocs, query, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
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

        ;
        ;
        ;

        const ordersQuery = query(
            ordersRef,
            where("orderDate", ">=", startOfDayTimestamp),
            where("orderDate", "<=", endOfDayTimestamp),
        );


        const querySnapshot = await getDocs(ordersQuery); // ดึงข้อมูลจาก Firestore

        ; // << เช็กว่ามาถึงตรงนี้ไหม
        if (querySnapshot.empty) {
            ;
            return [];
        }

        ;

        const orderss = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        ;

        const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();
            const cartRef = orderData.cart_id;
            if (!cartRef) return null; // ป้องกัน Error ถ้าไม่มี cart_id

            const cartSnap = await getDoc(cartRef);
            if (cartSnap.exists()) {
                const cartData = cartSnap.data();
                orderData.cart_id = { id: cartRef.id, ...cartData || {} }; // กำหนดเป็น object ที่มี id

                
                if (orderData.cart_id.status == false) {
                    return orderData
                } else {
                    return null
                }
            } else {
                throw new Error("cart not found");
            }
        }));

        
        return orders.filter(order => order !== null);
    } catch (error) {
        ;
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

        // ดึง orders เฉพาะของวันนี้
        const ordersQuery = query(
            ordersRef,
            where("orderDate", ">=", startOfDayTimestamp),
            where("orderDate", "<=", endOfDayTimestamp)
        );

        const querySnapshot = await getDocs(ordersQuery); // ดึงข้อมูลจาก Firestore

        if (querySnapshot.empty) {
            ;
            return 0; // คืนค่า 0 ถ้าไม่มีคำสั่งซื้อ
        }

        // กรองเฉพาะออเดอร์ที่มี statusOrder เป็น "Completed"
        const completedOrders = querySnapshot.docs
            .map(doc => doc.data())
            .filter(order => order.statusOrder === "Completed" || order?.statusOrder === "Received");

        if (completedOrders.length === 0) {
            ;
            return 0; // คืนค่า 0 ถ้าไม่มีคำสั่งซื้อที่เสร็จสมบูรณ์
        }

        // คำนวณยอดรวมจาก total_price ของทุกคำสั่งซื้อที่กรองมา
        const totalSales = completedOrders.reduce((sum, order) => {
            return sum + (order.total_price || 0);
        }, 0);

        ;
        return totalSales;

    } catch (error) {
        ;
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
            ;
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

        ;
        return totalSales;
    } catch (error) {
        ;
        return 0; // หากเกิดข้อผิดพลาดจะส่งกลับ 0
    }
};

export const getAllDailyOnlineSales = async () => {
    try {
        const ordersRef = collection(db, "orders");

        // ดึงข้อมูลออเดอร์ทั้งหมด
        const querySnapshot = await getDocs(ordersRef);

        if (querySnapshot.empty) {
            ;
            return {};
        }

        const salesByDate: Record<string, number> = {};

        querySnapshot.docs.forEach(doc => {
            const order = doc.data();
            if (order.statusOrder !== "Completed" || !order.orderDate) return;

            // แปลง orderDate เป็นวันที่ (Timestamp -> Date)
            const orderDate = order.orderDate.toDate();
            const dateKey = orderDate.toISOString().split("T")[0]; // เอาเฉพาะ YYYY-MM-DD

            // รวมยอดขายของวันนั้น
            salesByDate[dateKey] = (salesByDate[dateKey] || 0) + (order.total_price || 0);
        });

        ;
        return salesByDate;

    } catch (error) {
        ;
        return {};
    }
};

export const getAllDailyInStoreSales = async () => {
    try {
        const dailySalesRef = collection(db, "dailySales");

        // ดึงข้อมูลทั้งหมดจาก Firestore
        const querySnapshot = await getDocs(dailySalesRef);

        if (querySnapshot.empty) {
            ;
            return {};
        }

        const salesByDate: Record<string, number> = {};

        querySnapshot.docs.forEach(doc => {
            const salesData = doc.data();
            if (!salesData.salesDate || typeof salesData.totalSales !== "number") return;

            // แปลง salesDate (Timestamp) เป็น Date และแปลงเป็น string รูปแบบ YYYY-MM-DD
            const salesDate = salesData.salesDate.toDate();
            const dateKey = salesDate.toISOString().split("T")[0];

            // รวมยอดขายของวันนั้น
            salesByDate[dateKey] = (salesByDate[dateKey] || 0) + salesData.totalSales;
        });

        ;
        return salesByDate;

    } catch (error) {
        ;
        return {};
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
        ;
        throw new Error("Failed to create review");
    }
};

export const deleteDailySales = async (date: string): Promise<void> => {
    try {
        const salesRef = collection(db, "dailySales");
    
        // แปลง date (YYYY-MM-DD) เป็น Timestamp
        const timestamp = Timestamp.fromDate(new Date(date));
    
        // ค้นหาเอกสารที่มี salesDate ตรงกับ timestamp
        const q = query(salesRef, where("salesDate", "==", timestamp));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          ;
          return;
        }
    
        // ลบเอกสารทั้งหมดที่ตรงกับวันที่ที่ค้นพบ
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
    
        ;
    } catch (error) {
        ;
        throw new Error("Failed to delete review.");
    }
};
  
