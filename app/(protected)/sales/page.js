// app/sales/page.js
'use client';

import { useProducts } from '@/app/providers/ProductContext';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiUser, FiSearch, FiPrinter } from 'react-icons/fi';

// Demo data
const demoProducts = [
  { id: '1', code: 'PROD-001', name: 'Premium Chocolate', category: 'food', price: 5.99, cost: 3.50, inStock: 100, taxRate: 0.08 },
  { id: '2', code: 'PROD-002', name: 'Wireless Headphones', category: 'electronics', price: 89.99, cost: 45.00, inStock: 25, taxRate: 0.10 },
  { id: '3', code: 'PROD-003', name: 'Office Chair', category: 'furniture', price: 199.99, cost: 120.00, inStock: 15, taxRate: 0.10 },
  { id: '4', code: 'PROD-004', name: 'Cotton T-Shirt', category: 'clothing', price: 19.99, cost: 8.50, inStock: 50, taxRate: 0.08 },
  { id: '5', code: 'PROD-005', name: 'Smart Watch', category: 'electronics', price: 149.99, cost: 75.00, inStock: 30, taxRate: 0.10 },
];

const demoCustomers = [
  { id: '1', name: 'Retail Customer', type: 'retail', discount: 0 },
  { id: '2', name: 'Wholesale Buyer', type: 'wholesale', discount: 0.15 },
  { id: '3', name: 'VIP Customer', type: 'vip', discount: 0.10 },
];

export default function ERPSalesPage() {
  // State management
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(demoCustomers[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(demoProducts);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', type: 'retail', discount: 0 });

  // Filter products
  const filteredProducts = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.inStock > 0;
  });

  // Cart operations
  const addToCart = (productId) => {
    const product = inventory.find(p => p.id === productId);
    if (!product || product.inStock <= 0) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (existingItem) {
        if (existingItem.quantity >= product.inStock) return prevCart;
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId,
            code: product.code,
            name: product.name,
            price: product.price,
            cost: product.cost,
            taxRate: product.taxRate,
            quantity: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = inventory.find(p => p.id === productId);
    if (!product || newQuantity < 1 || newQuantity > product.inStock) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Order calculations
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const customerDiscount = subtotal * selectedCustomer.discount;
  const taxableAmount = subtotal - customerDiscount;
  const tax = cart.reduce((total, item) => total + (item.price * item.quantity * item.taxRate), 0);
  const total = taxableAmount + tax;
  const profit = cart.reduce((total, item) => total + ((item.price - item.cost) * item.quantity), 0) - customerDiscount;

  // Complete sale
  const completeSale = () => {
    if (cart.length === 0) return;

    // Create order
    const newOrder = {
      id: `ORD-${orders.length + 1}`,
      date: new Date().toISOString(),
      customer: selectedCustomer,
      items: cart,
      subtotal,
      discount: customerDiscount,
      tax,
      total,
      paymentMethod,
      notes: orderNotes,
      profit
    };

    // Update inventory
    const updatedInventory = inventory.map(product => {
      const cartItem = cart.find(item => item.productId === product.id);
      if (cartItem) {
        return { ...product, inStock: product.inStock - cartItem.quantity };
      }
      return product;
    });

    // Update state
    setOrders([...orders, newOrder]);
    setInventory(updatedInventory);
    setCart([]);
    setOrderNotes('');
    setIsCartOpen(false);
    
    // Print receipt (simulated)
    alert(`Order ${newOrder.id} completed successfully!\nTotal: $${total.toFixed(2)}`);
  };

  // Add new customer
  const addCustomer = () => {
    const customer = {
      id: `CUST-${demoCustomers.length + 1}`,
      ...newCustomer
    };
    setSelectedCustomer(customer);
    setDemoCustomers([...demoCustomers, customer]);
    setNewCustomer({ name: '', type: 'retail', discount: 0 });
    setShowCustomerModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">ERP Sales System</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-blue-700 hover:bg-blue-800"
            >
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            <div className="flex items-center bg-blue-700 rounded px-3 py-1">
              <FiUser size={16} className="mr-2" />
              <select 
                value={selectedCustomer.id}
                onChange={(e) => setSelectedCustomer(demoCustomers.find(c => c.id === e.target.value))}
                className="bg-transparent outline-none"
              >
                {demoCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.type})
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setShowCustomerModal(true)}
                className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded"
              >
                + New
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.code}</p>
                  </div>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className={`text-sm ${product.inStock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                    Stock: {product.inStock}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={product.inStock <= 0}
                  className={`w-full py-2 rounded-md flex items-center justify-center gap-2 ${product.inStock <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <FiPlus size={16} />
                  {product.inStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No products found matching your criteria</p>
          </div>
        )}
      </main>

      {/* Sales Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Sales Cart</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {selectedCustomer.name} ({selectedCustomer.type})
                      </span>
                      <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Your cart is empty</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Continue Browsing
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ul className="divide-y divide-gray-200">
                          {cart.map(item => {
                            const product = inventory.find(p => p.id === item.productId);
                            return (
                              <li key={item.productId} className="py-3">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h3 className="font-medium">{item.name}</h3>
                                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.code} | Tax: {(item.taxRate * 100)}%</p>
                                    <div className="flex items-center mt-2">
                                      <button
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                      >
                                        <FiMinus size={14} />
                                      </button>
                                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        disabled={product && item.quantity >= product.inStock}
                                        className={`p-1 rounded ${product && item.quantity >= product.inStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                      >
                                        <FiPlus size={14} />
                                      </button>
                                      <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="ml-4 p-1 text-red-500 hover:text-red-700"
                                      >
                                        <FiTrash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="mt-6 space-y-3">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          {selectedCustomer.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({selectedCustomer.type}):</span>
                              <span>-${customerDiscount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Estimated Profit:</span>
                            <span>${profit.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit Card</option>
                            <option value="debit">Debit Card</option>
                            <option value="bank">Bank Transfer</option>
                          </select>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                          <textarea
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={2}
                            placeholder="Special instructions..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={completeSale}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2"
                      >
                        <FiPrinter size={18} />
                        Complete Sale
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Add New Customer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                <select
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="retail">Retail (0% discount)</option>
                  <option value="wholesale">Wholesale (15% discount)</option>
                  <option value="vip">VIP (10% discount)</option>
                </select>
              </div>
              {['wholesale', 'vip'].includes(newCustomer.type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Discount ({newCustomer.type === 'wholesale' ? '15%' : '10%'} default)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={newCustomer.discount * 100}
                    onChange={(e) => setNewCustomer({...newCustomer, discount: parseFloat(e.target.value) / 100})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                disabled={!newCustomer.name}
                className={`px-4 py-2 rounded-md text-white ${!newCustomer.name ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}