import { collection, doc, addDoc, where, getDocs, query, getDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../interfaces/review';

export const getReviewByUserId = async (userId: string) => {
    try {
        const reviewRef = collection(db, "reviews");
        const userRef = doc(db, "users", userId);  // Assume `userId` is the document ID in the "users" collection

        const q = query(reviewRef, where("user_id", "==", userRef)); // ไม่ต้องกรอง deletedAt ที่นี่
        const querySnapshot = await getDocs(q);

        const review = Promise.all(querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const orderRef = data.order_id;

            const orderSnap = await getDoc(orderRef);
            if (orderSnap) {
                const orderData = orderSnap.data();
                data.order_id = { id: orderRef.id, ...orderData || {} };
            } else {
                throw new Error("cart not found");
            }

            const userSnap = await getDoc(data.user_id);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                data.user_id = { id: userSnap.id, ...userData || {} };
            } else {
                throw new Error("User not found");
            }

            return {
                id: doc.id,
                rating: data.rating || '',
                comment: data.comment || '',
                user_id: data.user_id || '',
                order_id: data.order_id,
                deletedAt: data.deletedAt || null,  // เพิ่มการเช็ค deletedAt
            };
        }));

        console.log(review);
        return review;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};


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

export const deleteReview = async (reviewId: string): Promise<void> => {
    try {
        const reviewRef = doc(db, "reviews", reviewId);
        await updateDoc(reviewRef, {
            deletedAt: serverTimestamp(), // บันทึกเวลาปัจจุบัน
        });
        console.log(`Review with ID: ${reviewId} marked as deleted.`);
    } catch (error) {
        console.error("Error deleting review:", error);
        throw new Error("Failed to delete review.");
    }
};

export const updateReview = async (reviewId: string, updatedReview: Review): Promise<void> => {
    try {
        // ตรวจสอบว่าเอกสารรีวิวมีอยู่ใน Firestore หรือไม่
        const reviewRef = doc(db, "reviews", reviewId);
        const reviewSnapshot = await getDoc(reviewRef);
        console.log("upreview", reviewSnapshot)
        console.log("upreviewid", reviewId)
        

        // ถ้ามีเอกสาร ให้ทำการอัพเดทข้อมูล
        await updateDoc(reviewRef, {
            rating:5,
            comment: updatedReview.comment,
            updatedAt: new Date(), // อัพเดทวันที่
        });
    } catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to update review");
    }
};