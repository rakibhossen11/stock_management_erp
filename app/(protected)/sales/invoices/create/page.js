// app/(protected)/sales/invoices/create/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiTrash2, FiSearch, FiPrinter, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function CreateInvoice() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [invoice, setInvoice] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: '',
    items: []
  });

  // Fetch products and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        const mockProducts = [
          { id: 'prod-001', code: 'CHAIR-001', name: 'Office Chair Deluxe', price: 129.99, stock: 45 },
          { id: 'prod-002', code: 'KB-2023', name: 'Wireless Keyboard', price: 49.99, stock: 8 },
          { id: 'prod-003', code: 'MON-24A', name: '24" LED Monitor', price: 179.99, stock: 0 },
        ];
        
        const mockCustomers = [
          { id: 'cust-001', name: 'Acme Corp', email: 'contact@acme.com', phone: '+1234567890' },
          { id: 'cust-002', name: 'Globex Inc', email: 'info@globex.com', phone: '+9876543210' },
        ];
        
        setProducts(mockProducts);
        setCustomers(mockCustomers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to invoice
  const addProduct = (product) => {
    setInvoice(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price
        }
      ]
    }));
    setSearchTerm('');
  };

  // Update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setInvoice(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
        total: newQuantity * updatedItems[index].price
      };
      return { ...prev, items: updatedItems };
    });
  };

  // Remove item from invoice
  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Save invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      console.log('Submitting invoice:', {
        ...invoice,
        subtotal,
        tax,
        total,
        status: 'pending'
      });
      
      // Redirect to invoices list after successful creation
      router.push('/sales/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Customer and Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={invoice.customerId}
                  onChange={(e) => setInvoice({...invoice, customerId: e.target.value})}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={invoice.date}
                    onChange={(e) => setInvoice({...invoice, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-md p-2"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={invoice.paymentMethod}
                  onChange={(e) => setInvoice({...invoice, paymentMethod: e.target.value})}
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_term">Credit Term</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Search and Selection */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Products</h2>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => addProduct(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.code} - ${product.price.toFixed(2)}</p>
                    </div>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Invoice Items */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
          
          {invoice.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added to this invoice yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            type="button"
                            className="p-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <FiMinus />
                          </button>
                          <input
                            type="number"
                            min="1"
                            className="w-16 mx-2 border rounded text-center"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                          />
                          <button 
                            type="button"
                            className="p-1 text-gray-500 hover:text-gray-700"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeItem(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes and Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <textarea
            className="w-full border rounded-md p-2 h-24"
            placeholder="Any additional notes for this invoice..."
            value={invoice.notes}
            onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/sales/invoices')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiSave className="mr-2" />
            Save Invoice
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            onClick={() => {
              // Save and print functionality
              handleSubmit(new Event('submit'));
              window.print();
            }}
          >
            <FiPrinter className="mr-2" />
            Save & Print
          </button>
        </div>
      </form>
    </div>
  );
}