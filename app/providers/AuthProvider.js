'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // console.log("from context",user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  //  useEffect(() => {
  //   async function loadUser() {
  //     try {
  //       // Check if we have a token
  //       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
  //       if (token) {
  //         // Verify token with backend
  //         const response = await fetch('/api/auth/verify', {
  //           headers: {
  //             'Authorization': `Bearer ${token}`
  //           }
  //         });
          
  //         if (response.ok) {
  //           const userData = await response.json();
  //           setUser(userData);
  //         } else {
  //           // Token is invalid, clear it
  //           localStorage.removeItem('token');
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error loading user:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadUser();
  // }, []);

  // const checkSession = async () => {
  //   try {
  //     const res = await fetch('/api/auth/session');
  //     console.log(res);
  //     const data = await res.json();
  //     console.log(data);
  //     // setUser(data.session || null);
  //   } catch (error) {
  //     console.error('Session check failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch('/api/auth/session');
  //       const data = await res.json();
  //       if (data.user) setUser(data.user);
  //     } catch (error) {
  //       console.error('Session check failed', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, [pathname]);


  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { user: userData, token } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
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
    console.log("register",name, email, password);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(response);

      if (response.ok) {
        const { user: userData, token } = await response.json();
        localStorage.setItem('token', token);
        setUser(userData);
        router.push('/dashboard');
      } else {
        throw new Error('Register failed');
      }

      // if (!res.ok) {
      //   const error = await res.json();
      //   throw new Error(error.error);
      // }

      // const data = await res.json();
      // console.log("re",data);
      // setUser(data.user);
      // router.push('/dashboard');
      // return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  // const logout = async () => {
  //   await fetch('/api/auth/signout', { method: 'POST' });
  //   setUser(null);
  //   router.push('/auth/login');
  // };

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      console.log(data);
      setUser(data.session.user || null);
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

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

// export function useAuth() {
//   return useContext(AuthContext);
// }