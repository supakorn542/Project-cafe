import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../interfaces/review';

export const addReviewById = async (id: string, newReview: Omit<Review, 'id'>): Promise<void> => {
    const reviewsCol = collection(db, 'reviews'); // อ้างอิง collection 'reviews'
    const reviewDoc = doc(reviewsCol, id); // ระบุ ID ของเอกสารที่ต้องการสร้าง
    await setDoc(reviewDoc, {
        rating: newReview.rating,
        comment: newReview.comment,
        payment_id: newReview.payment_id,
    });
};

