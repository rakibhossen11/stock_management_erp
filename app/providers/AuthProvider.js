'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // console.log("from context",user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  // check session always user if are login or not 
   const checkSession = async () => {
    try {
      toast.loading("Check Authentication..");
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      console.log(data);
      setUser(data.session.user || null);
      toast.success("Authenticated!");
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // user check effect
   useEffect(() => {
    checkSession();
  }, []);

  // user login if existing
  const login = async (email, password) => {
    try {
      toast.loading("Login...");
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
        toast.success("Login Succesful !");
        router.push('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  //   user registration
  const register = async (name, email, password) => {
    // console.log("register",name, email, password);
    try {
      toast.loading("User creating");
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      // console.log(response);

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);
        toast.success("User created Succesfuliy");
        router.push('/dashboard');
      } else {
        throw new Error('Register failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // user logout
  const logout = async() => {
    await fetch('/api/auth/signout',{ method: 'POST' });
    setUser(null);
    toast.success("Logout");
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user, 
        loading,
        login,
        register,
        logout,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}