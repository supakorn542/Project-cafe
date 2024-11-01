
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const deleteProduct = async (id : string) => {
    try {
      await deleteDoc(doc(db, 'product', id));
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };