'use client'; // Must be at the very top

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Changed from 'next/router'
import { useContext, useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../providers/AuthProvider'; // Make sure this is the correct path
import { FiUser, FiLogIn, FiLogOut, FiShoppingCart, FiBell, FiSearch } from 'react-icons/fi';

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();
  console.log(user);

  // Protected routes - only accessible when logged in
//   const protectedRoutes = ['/dashboard', '/products', '/sales'];
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Public routes (before login)
  const publicRoutes = [
    { path: "Home", href: "/" },
    { path: "About", href: "/about" },
    { path: "Contact", href: "/contact" },
  ];

  const protectedRoutes = [
    { path: "Dashboard", href: "/dashboard" },
    { path: "Products", href: "/products" },
    { path: "Sales", href: "/sales" },
  ];

  // Combine routes based on auth status
  const routes = user ? [...publicRoutes, ...protectedRoutes] : publicRoutes;
  // console.log(routes);

  // This ensures the component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);


if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main links */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 mr-2.5">
              ERP System
            </Link>
            <div className=" md:flex space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.href}
                  className={`text-sm font-medium ${
                    pathname === route.path
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {route.path}
                </Link>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center">
            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Cart */}
            <button
              type="button"
              className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="sr-only">View cart</span>
              <FiShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <div className="ml-4 relative">
              {loading ? (
                <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(!isOpen);
                    }}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiLogIn className="mr-2" />
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiUser className="mr-2" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        
      {/* <div className="container mx-auto px-4 py-3 flex justify-between items-center">
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
      </div> */}
    </header>
  );
};

export default Header;