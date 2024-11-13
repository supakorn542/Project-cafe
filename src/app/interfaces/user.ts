export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  telNumber: string | null;
  email: string | null; 
  dob: Date | null; 
  createdAt?: Date;
}
