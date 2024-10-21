import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase'; 

export const checkAuthState = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); 
      } else {
        resolve(null); 
      }
    });
  });
};
