import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { statusInterface } from '../interfaces/statusInterface';

export const getStatus = async (): Promise<statusInterface[]> => {
    const statusCol = collection(db, 'status');
    const statusSnapshot = await getDocs(statusCol);
    const status = statusSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
    }))
    return status
}