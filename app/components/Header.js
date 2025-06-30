'use client'; // Must be at the very top

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { useContext } from 'react';
import { AuthProvider, useAuth } from '../providers/AuthProvider'; // Make sure this is the correct path

const Header = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  console.log(user);

  // Protected routes - only accessible when logged in
  const protectedRoutes = ['/dashboard', '/products', '/sales'];
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  // Don't show header on auth pages
  if (['/login', '/register'].includes(currentPath)) return null;

  // Redirect to login if trying to access protected route while not authenticated
  if (!loading && !user && protectedRoutes.includes(currentPath)) {
    router.push('/login');
    return null;
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold">
            ERP System
          </Link>
          
          {user && (
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className={`hover:text-blue-200 ${currentPath === '/dashboard' ? 'font-semibold underline' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/products"
                className={`hover:text-blue-200 ${currentPath === '/products' ? 'font-semibold underline' : ''}`}
              >
                Products
              </Link>
              <Link 
                href="/sales"
                className={`hover:text-blue-200 ${currentPath === '/sales' ? 'font-semibold underline' : ''}`}
              >
                Sales
              </Link>
            </nav>
          )}
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Welcome, {user.name}</span>
            <button 
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          !protectedRoutes.includes(currentPath) && (
            <div className="flex space-x-3">
              <Link 
                href="/login"
                className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition"
              >
                Register
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default Header;