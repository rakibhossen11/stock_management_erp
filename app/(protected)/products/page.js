'use client';
// pages/products/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '@/app/providers/ProductContext';

export default function ProductInventory() {
  // const [products, setProducts] = useState([]);
  const { products, loading, error } = useProducts();
  console.log(products);
  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    // if (filter === 'out-of-stock') return product.status === 'out-of-stock';
    // if (filter === 'low-stock') return product.status === 'low-stock';
    return true;
  });
  console.log(filteredProducts);

  const getStatusColor = (status) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'out-of-stock': return 'Out of Stock';
      case 'low-stock': return 'Low Stock';
      default: return 'In Stock';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Inventory</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">1,245</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold text-yellow-600">37</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Recently Added</h3>
          <p className="text-2xl font-bold">28</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <input 
              type="radio" 
              id="filter-all" 
              name="filter" 
              checked={filter === 'all'} 
              onChange={() => setFilter('all')}
              className="mr-2"
            />
            <label htmlFor="filter-all">All Products</label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="filter-out" 
              name="filter" 
              checked={filter === 'out-of-stock'} 
              onChange={() => setFilter('out-of-stock')}
              className="mr-2"
            />
            <label htmlFor="filter-out">Out of Stock Only</label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="filter-low" 
              name="filter" 
              checked={filter === 'low-stock'} 
              onChange={() => setFilter('low-stock')}
              className="mr-2"
            />
            <label htmlFor="filter-low">Low Stock Only</label>
          </div>
          
          <select className="border rounded px-3 py-1 ml-auto">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Office Supplies</option>
          </select>
          
          <select className="border rounded px-3 py-1">
            <option>All Locations</option>
            <option>Main Warehouse</option>
            <option>East Warehouse</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      {/* <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.productCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.productCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.reorderLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link href={`/products/edit/${product.productCode}`} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                      <Link href={`/products/view/${product.productCode}`} className="text-green-600 hover:text-green-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
      <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.productCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.reorderLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link href={`/products/edit/${product.productCode}`} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                      <Link href={`/products/view/${product._id}`} className="text-green-600 hover:text-green-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

      {/* Quick Stock Update */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-medium mb-4">Quick Stock Update</h3>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Code</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="Enter product code" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
            <select className="mt-1 block w-full border rounded-md p-2">
              <option>Add Stock</option>
              <option>Remove Stock</option>
              <option>Set Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" className="mt-1 block w-full border rounded-md p-2" placeholder="0" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="Optional notes" />
          </div>
          <div className="md:col-span-5">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Submit Update
            </button>
          </div>
        </form>
      </div>

      {/* Notifications */}
      <div className="mt-6 space-y-2">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500 font-bold">Urgent:</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                MON-24A (24" LED Monitor) has been out of stock for 5 days - purchase order recommended
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                KB-2023 (Wireless Keyboard) stock level below reorder point
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Last full inventory sync: Today, 08:00 AM
        </div>
        <div className="space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded-md">Refresh Data</button>
          <button className="bg-gray-200 px-4 py-2 rounded-md">Print Report</button>
          <Link 
          href="/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Product
          </Link>
        </div>
      </div>
    </div>
  );
}