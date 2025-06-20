'use client';

import { useState } from 'react';
import { FiShoppingCart, FiX, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 'prod-001',
      name: 'Office Chair Deluxe',
      price: 129.99,
      quantity: 2,
      image: '/chair.jpg'
    },
    {
      id: 2,
      productId: 'prod-002',
      name: 'Wireless Keyboard',
      price: 49.99,
      quantity: 1,
      image: '/keyboard.jpg'
    }
  ]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
      >
        <FiShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b">
            <h3 className="font-medium">Shopping Cart</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="p-4 border-b">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-md object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Your cart is empty
              </div>
            )}
          </div>
          <div className="p-2 border-t">
            <Link
              href="/cart"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Cart
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}