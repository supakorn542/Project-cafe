
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const deleteProduct = async (id : string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      ;
    } catch (error) {
      ;
    }
  };