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
