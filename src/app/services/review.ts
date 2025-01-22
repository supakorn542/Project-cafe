import { collection, doc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../interfaces/review';

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

