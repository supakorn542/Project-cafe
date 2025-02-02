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

        console.log("Fetching orders from Firestore...");
        console.log("Start of Day Timestamp:", startOfDayTimestamp.toDate());
        console.log("End of Day Timestamp:", endOfDayTimestamp.toDate());

        const ordersQuery = query(
            ordersRef,
            where("orderDate", ">=", startOfDayTimestamp),
            where("orderDate", "<=", endOfDayTimestamp),
        );


        const querySnapshot = await getDocs(ordersQuery); // ดึงข้อมูลจาก Firestore

        console.log("orderr", ordersQuery); // << เช็กว่ามาถึงตรงนี้ไหม
        if (querySnapshot.empty) {
            console.log("No orders found for today.");
            return [];
        }

        console.log("Number of orders found:", querySnapshot.size);

        const orderss = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched orders:", orderss);

        const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();
            const cartRef = orderData.cart_id;
            if (!cartRef) return null; // ป้องกัน Error ถ้าไม่มี cart_id

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

        console.log("Order To day", orders)
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

        // ดึง orders เฉพาะของวันนี้
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

        // กรองเฉพาะออเดอร์ที่มี statusOrder เป็น "Completed"
        const completedOrders = querySnapshot.docs
            .map(doc => doc.data())
            .filter(order => order.statusOrder === "Completed");

        if (completedOrders.length === 0) {
            console.log("No completed orders found for today.");
            return 0; // คืนค่า 0 ถ้าไม่มีคำสั่งซื้อที่เสร็จสมบูรณ์
        }

        // คำนวณยอดรวมจาก total_price ของทุกคำสั่งซื้อที่กรองมา
        const totalSales = completedOrders.reduce((sum, order) => {
            return sum + (order.total_price || 0);
        }, 0);

        console.log("Total completed sales for today:", totalSales);
        return totalSales;

    } catch (error) {
        console.error("Error fetching today's completed sales:", error);
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

export const getAllDailyOnlineSales = async () => {
    try {
        const ordersRef = collection(db, "orders");

        // ดึงข้อมูลออเดอร์ทั้งหมด
        const querySnapshot = await getDocs(ordersRef);

        if (querySnapshot.empty) {
            console.log("No orders found.");
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

        console.log("Daily sales report:", salesByDate);
        return salesByDate;

    } catch (error) {
        console.error("Error fetching all daily sales:", error);
        return {};
    }
};

export const getAllDailyInStoreSales = async () => {
    try {
        const dailySalesRef = collection(db, "dailySales");

        // ดึงข้อมูลทั้งหมดจาก Firestore
        const querySnapshot = await getDocs(dailySalesRef);

        if (querySnapshot.empty) {
            console.log("No in-store sales data found.");
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

        console.log("Daily in-store sales report:", salesByDate);
        return salesByDate;

    } catch (error) {
        console.error("Error fetching all daily in-store sales:", error);
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
        console.error("Error creating review:", error);
        throw new Error("Failed to create review");
    }
};
