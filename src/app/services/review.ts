import { collection, doc, addDoc, where, getDocs, query, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../interfaces/review';

export const getReviewByUserId = async (userId: string) => {
    try {
        const reviewRef = collection(db, "reviews");
        // สร้าง DocumentReference สำหรับ user_id
        const userRef = doc(db, "users", userId);  // Assume `userId` is the document ID in the "users" collection

        // ใช้ DocumentReference ใน query
        const q = query(reviewRef, where("user_id", "==", userRef));
        const querySnapshot = await getDocs(q);
        const review = Promise.all(querySnapshot.docs.map(async(doc) => {
            const data = doc.data();
            const orderRef = data.order_id;
            const orderSnap = await getDoc(orderRef);
            if (orderSnap) {
                const orderData = orderSnap.data();
                data.order_id = { id: orderRef.id, ...orderData || {} }; // กำหนดเป็น object ที่มี id
            } else {
                throw new Error("cart not found");
            }
            // แปลงข้อมูลให้ตรงกับ CartInterface ใหม่
            return {
                id: doc.id,
                rating: data.rating || '',  // กำหนดค่า default สำหรับ status
                comment: data.comment || '',
                user_id: data.user_id || '',
                order_id: data.order_id,
                // กำหนดค่า default สำหรับ user_id
            };
        }));

        console.log(review)
        return review;
    }
    catch (error) {
        console.error("Error fetching carts:", error);
        return [];
    }
}

export const createReview = async (review: Review): Promise<void> => {
    try {
        const userRef = doc(db, "users", review.user_id);
        const orderRef = doc(db, "orders", review.order_id);

        const reviewCollection = collection(db, 'reviews');
        await addDoc(reviewCollection, {
            user_id: userRef,
            rating: review.rating,
            comment: review.comment,
            order_id: orderRef,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Failed to create review");
    }
};

