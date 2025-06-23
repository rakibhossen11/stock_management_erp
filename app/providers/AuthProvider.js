'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  console.log("from context",user);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

   useEffect(() => {
    async function loadUser() {
      try {
        // Check if we have a token
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

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

  // const login = async (email, password) => {
  //   // console.log(email,password);
  //   try {
  //     const res = await fetch('/api/auth/signin', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({email, password}),
  //     });
      
  //     if (!res.ok) {
  //       const error = await res.json();
  //       throw new Error(error.error);
  //     }

  //     const data = await res.json();
  //     console.log("login",data);
  //     setUser(data.user);
  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

//   user registration
  const register = async (name, email, password) => {
    // console.log("register",name, email, password);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( name, email, password ),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const data = await res.json();
      console.log("re",data);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
    router.push('/auth/login');
  };

  useEffect(() => {
    // checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, 
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   console.log(user);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch('/api/auth/me');
//         const data = await response.json();
        
//         if (data.success) {
//           setUser(data.data);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const signOut = async () => {
//     await fetch('/api/auth/signout', { method: 'POST' });
//     setUser(null);
//     router.push('/signin');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);