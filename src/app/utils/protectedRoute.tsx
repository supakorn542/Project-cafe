'use client'

import { useEffect } from 'react';
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";


const ProtectedRoute = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user && !loading) {
        
        const isSignOut = localStorage.getItem('signOut') === 'true';
        if (isSignOut) {
          localStorage.removeItem('signOut');
          router.push("/");
        } else {
          router.push("/signin");
        }
      }
    }, [user, router, loading]);

    if (loading) {
      return <div>Redirecting...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default ProtectedRoute;
