"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Define a TypeScript type for User
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default function Home() {
  // Specify that the users state will be an array of User objects
  const [users, setUsers] = useState<User[]>([]);

  // Fetch data from Firestore emulator
  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, 'users'); // Access 'users' collection
      const usersSnapshot = await getDocs(usersCollection); // Get documents
      const usersList: User[] = usersSnapshot.docs.map(doc => {
        const data = doc.data() as Omit<User, 'id'>; // Exclude 'id' from data
        return { id: doc.id, ...data }; // Merge 'id' with the rest of the data
      });
      setUsers(usersList); // Set the fetched users to state
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>TEST Emulator</h1>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
