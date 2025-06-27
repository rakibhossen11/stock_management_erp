// app/invoices/create/page.js
"use client";

import { useProducts } from "@/app/providers/ProductContext";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiMinus,
  FiTrash2,
  FiSearch,
  FiPrinter,
  FiUser,
  FiCalendar,
  FiX,
  FiCheck,
} from "react-icons/fi";

const demoCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Acme Corp", email: "acme@example.com" },
  { id: "3", name: "Jane Smith", email: "jane@example.com" },
];

export default function CreateInvoicePage() {
  const { products, createInvoice} = useProducts();
  // console.log(products)
  // Form state
  const [invoice, setInvoice] = useState({
    customer: null,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [],
    notes: "",
    terms: "Payment due within 7 days",
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculations
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity * item.taxRate,
    0
  );
  const total = subtotal + tax;

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    // console.log(productId);
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    // Initialize quantity to 1 if not set
    if (!quantities[productId]) {
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
    }
  };
  // console.log(selectedProducts);

  // Add selected products to invoice (without quantities)
  const addSelectedToInvoice = () => {
    setInvoice((prev) => {
      // Get current items
      const currentItems = [...prev.items];
      // console.log(currentItems);

      // Process each selected product
      selectedProducts.forEach((productId) => {
        const product = products.find((p) => p._id === productId);
        console.log(product);

        // Check if product already exists in invoice
        const existingItem = currentItems.find((item) => item.id === productId);

        if (!existingItem) {
          // Only add product if it doesn't exist
          currentItems.push({
            id: product._id,
            code: product.code,
            name: product.name,
            price: product.sellingPrice,
            taxRate: product.taxRate,
            quantity: 1, // Default to 1 since we're not managing quantities
          });
        }
      });

      return {
        ...prev,
        items: currentItems,
      };
    });

    // Reset selection
    setSelectedProducts([]);
    setShowProductModal(false);
  };
  // console.log(invoice)

  // Add item to invoice
  const addItem = (product) => {
    setInvoice((prev) => {
      const existingItem = prev.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              id: product.id,
              code: product.code,
              name: product.name,
              price: product.price,
              taxRate: product.taxRate,
              quantity: 1,
            },
          ],
        };
      }
    });
    setShowProductModal(false);
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    // Convert to number in case it's a string (from input field)
    quantity = Number(quantity);

    // Find the item to check stock limits
    const item = invoice.items.find((item) => item.id === id);

    if (!item) return; // Item not found

    // Validate quantity
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    // Ensure quantity doesn't exceed available stock
    if (item.stock !== undefined && quantity > item.stock) {
      quantity = item.stock;
    }

    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  };

  // // Update item quantity
  // const updateQuantity = (id, quantity) => {
  //   if (quantity < 1) {
  //     removeItem(id);
  //     return;
  //   }

  //   setInvoice((prev) => ({
  //     ...prev,
  //     items: prev.items.map((item) =>
  //       item.id === id ? { ...item, quantity } : item
  //     ),
  //   }));
  // };

  // Remove item from invoice
  const removeItem = (id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Add new customer
  const addCustomer = () => {
    const customer = {
      id: `cust-${demoCustomers.length + 1}`,
      ...newCustomer,
    };
    demoCustomers.push(customer);
    setInvoice((prev) => ({ ...prev, customer }));
    setNewCustomer({ name: "", email: "" });
    setShowCustomerModal(false);
  };

  // Generate invoice
  const generateInvoice = () => {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceData = {
      ...invoice,
      invoiceNumber,
      subtotal,
      tax,
      total,
      date: new Date().toISOString(),
    };

    // In a real app, you would save to database here
    // console.log("Invoice generated:", invoiceData);
    createInvoice(invoiceData);
    // alert(
    //   `Invoice ${invoiceNumber} created successfully!\nTotal: $${total.toFixed(
    //     2
    //   )}`
    // );

    // Reset form
    // setInvoice({
    //   customer: null,
    //   date: new Date().toISOString().split("T")[0],
    //   dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    //     .toISOString()
    //     .split("T")[0],
    //   items: [],
    //   notes: "",
    //   terms: "Payment due within 7 days",
    // });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Invoice Header */}
        <div className="p-6 bg-gray-800 text-white">
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
        </div>

        {/* Customer and Date Info */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <div className="flex items-center">
                {invoice.customer ? (
                  <div className="flex-1">
                    <p className="font-medium">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-500">
                      {invoice.customer.email}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-400">Select customer</span>
                )}
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Select
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) =>
                    setInvoice({ ...invoice, date: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) =>
                    setInvoice({ ...invoice, dueDate: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <FiCalendar className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Items</h2>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FiPlus /> Add Item
            </button>
          </div>

          {invoice.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items added to this invoice
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${item?.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </button>

                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, e.target.value)
                            }
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.taxRate * 100}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        $
                        {(
                          item.price *
                          item.quantity *
                          (1 + item.taxRate)
                        ).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoice Summary */}
        <div className="p-6 border-b">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={invoice.notes}
                onChange={(e) =>
                  setInvoice({ ...invoice, notes: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Additional notes for the customer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms
              </label>
              <textarea
                value={invoice.terms}
                onChange={(e) =>
                  setInvoice({ ...invoice, terms: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Payment terms and conditions"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex justify-end space-x-3">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Save Draft
          </button>
          <button
            onClick={generateInvoice}
            disabled={!invoice.customer || invoice.items.length === 0}
            className={`px-6 py-2 rounded-md text-white flex items-center gap-2 ${
              !invoice.customer || invoice.items.length === 0
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FiPrinter /> Generate Invoice
          </button>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Select Customer</h3>

              <div className="mb-4">
                <button
                  onClick={() => {
                    setNewCustomer({ name: "", email: "" });
                    setShowCustomerModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-3"
                >
                  + New Customer
                </button>

                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {demoCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => {
                        setInvoice({ ...invoice, customer });
                        setShowCustomerModal(false);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Select Products</h3>

              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No products found
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tax
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products?.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.code}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            ${product.sellingPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            {product.taxRate * 100}%
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleProductSelection(product._id)}
                              className={`p-2 rounded-full ${
                                selectedProducts.includes(product._id)
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <FiCheck size={18} />
                            </button>
                            {/* <button
                              onClick={() => addItem(product)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Add
                            </button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={addSelectedToInvoice}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                  disabled={selectedProducts.length === 0}
                >
                  <FiCheck size={16} />
                  Add {selectedProducts.length} Item(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {newCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">New Customer</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setNewCustomer(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomer}
                  disabled={!newCustomer.name}
                  className={`px-4 py-2 rounded text-white ${
                    !newCustomer.name
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
