'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAuthState } from '../lib/auth'; 
import { User } from 'firebase/auth';


export const AuthContext = createContext<{ 
  user: User | null; 
  loading: boolean;
  setUser: (user: User | null) => void; 
}>({
  user: null,
  loading: true,
  setUser: () => {}, 
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthState = async () => {
      const authenticatedUser = await checkAuthState();
      setUser(authenticatedUser);
      setLoading(false);
    };

    fetchAuthState(); 
  }, []);

  const value = { user, loading, setUser }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
