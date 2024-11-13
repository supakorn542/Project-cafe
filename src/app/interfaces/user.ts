export interface User {
  id: string;
  firstName: string;
  lastName: string;
  telNumber: string;
  email: string; 
  dob: Date | null; 
  createdAt?: Date;
}
