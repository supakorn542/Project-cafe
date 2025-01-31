import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  username: string | null
  firstName: string | null;
  lastName: string | null;
  telNumber: string | null;
  email: string | null; 
  dob: Date | Timestamp | null; 
  createdAt?: Date;
  profileImage?: string; 
  // role: string | null;
}
