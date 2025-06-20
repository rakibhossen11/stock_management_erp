"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    cost: "",
    category: "",
    stock: 0,
    minStock: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [transactionType, setTransactionType] = useState("buy");
  const [transactionAmount, setTransactionAmount] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from database
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch('/api/products');
  //       const data = await response.json();
  //       setProducts(data);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" ||
        name === "cost" ||
        name === "stock" ||
        name === "minStock"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    console.log(formData);

    // Add new product
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const newProduct = await response.json();

    // try {
    //   if (isEditing) {
    //     // Update existing product
    //     const response = await fetch(`/api/products/${formData.id}`, {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(formData),
    //     });
    //     const updatedProduct = await response.json();

    //     setProducts(
    //       products.map((product) =>
    //         product.id === formData.id ? updatedProduct : product
    //       )
    //     );
    //   } else {
    //     // Add new product
    //     const response = await fetch("/api/products", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(formData),
    //     });
    //     const newProduct = await response.json();

    //     setProducts([...products, newProduct]);
    //   }

    //   // Reset form
    //   setFormData({
    //     id: "",
    //     name: "",
    //     description: "",
    //     price: "",
    //     cost: "",
    //     category: "",
    //     stock: 0,
    //     minStock: 0,
    //   });
    //   setIsEditing(false);
    // } catch (error) {
    //   console.error("Error saving product:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      minStock: product.min_stock || 0, // Handle column name difference
    });
    setIsEditing(true);
  };

  const handleDelete = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${selectedProductId}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: transactionType,
          amount: Number(transactionAmount),
        }),
      });
      const updatedProduct = await response.json();

      setProducts(
        products.map((product) => {
          if (product.id === selectedProductId) {
            return updatedProduct;
          }
          return product;
        })
      );

      // Reset transaction form
      setSelectedProductId(null);
      setTransactionAmount(1);
    } catch (error) {
      console.error("Error updating stock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Apply category filter
    if (filter !== "all" && product.category !== filter) return false;

    // Apply search term filter
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Inventory Management | ERP System</title>
        <meta name="description" content="Manage your product inventory" />
      </Head>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {" "}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Form Column */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Selling Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cost"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Cost Price ($)
                      </label>
                      <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            id: "",
                            name: "",
                            description: "",
                            price: "",
                            cost: "",
                            category: "",
                            stock: 0,
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isEditing ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Stock Transaction Form */}
              {selectedProductId && (
                <div className="bg-white shadow rounded-lg p-6 mt-6">
                  <h2 className="text-lg font-medium mb-4">Update Stock</h2>
                  <form onSubmit={handleTransaction}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={transactionType === "buy"}
                            onChange={() => setTransactionType("buy")}
                          />
                          <span className="ml-2 text-gray-700">
                            Purchase (Add Stock)
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={transactionType === "sell"}
                            onChange={() => setTransactionType("sell")}
                          />
                          <span className="ml-2 text-gray-700">
                            Sale (Remove Stock)
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="transactionAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="transactionAmount"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedProductId(null)}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Process
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Product List Column */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h2 className="text-lg font-medium">Product Inventory</h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cost
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <tr
                            key={product.id}
                            className={
                              product.stock <= product.minStock
                                ? "bg-red-50"
                                : ""
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 capitalize">
                                {product.category}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${product.price.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${product.cost.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.stock}{" "}
                                {product.stock <= product.minStock && (
                                  <span className="text-red-600">
                                    (Low Stock)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedProductId(product.id);
                                  setTransactionType("buy");
                                  setTransactionAmount(1);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Stock
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-yellow-600 hover:text-yellow-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Inventory Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">
                      Total Products
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {products.length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">
                      Total Stock Value
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      $
                      {products
                        .reduce(
                          (sum, product) => sum + product.stock * product.price,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Low Stock Items
                    </h3>
                    <p className="text-2xl font-bold text-yellow-900">
                      {products.filter((p) => p.stock <= p.minStock).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">Processing...</p>
          </div>
        </div>
      )} */}
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import Head from 'next/head';

// export default function InventoryPage() {
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     description: '',
//     price: '',
//     cost: '',
//     category: '',
//     stock: 0
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [transactionType, setTransactionType] = useState('buy');
//   const [transactionAmount, setTransactionAmount] = useState(1);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Load sample data on first render
//   useEffect(() => {
//     const sampleProducts = [
//       {
//         id: '1',
//         name: 'Premium Laptop',
//         description: '16GB RAM, 1TB SSD, Intel i7',
//         price: 1299,
//         cost: 899,
//         category: 'electronics',
//         stock: 15,
//         minStock: 5
//       },
//       {
//         id: '2',
//         name: 'Wireless Mouse',
//         description: 'Ergonomic design, 2.4GHz wireless',
//         price: 49,
//         cost: 25,
//         category: 'electronics',
//         stock: 42,
//         minStock: 10
//       },
//       {
//         id: '3',
//         name: 'Office Chair',
//         description: 'Adjustable height, lumbar support',
//         price: 199,
//         cost: 120,
//         category: 'furniture',
//         stock: 8,
//         minStock: 3
//       }
//     ];
//     setProducts(sampleProducts);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'price' || name === 'cost' || name === 'stock' ? Number(value) : value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (isEditing) {
//       // Update existing product
//       setProducts(products.map(product =>
//         product.id === formData.id ? formData : product
//       ));
//     } else {
//       // Add new product
//       const newProduct = {
//         ...formData,
//         id: Date.now().toString(),
//         stock: formData.stock || 0,
//         minStock: 0
//       };
//       setProducts([...products, newProduct]);
//     }

//     // Reset form
//     setFormData({
//       id: '',
//       name: '',
//       description: '',
//       price: '',
//       cost: '',
//       category: '',
//       stock: 0
//     });
//     setIsEditing(false);
//   };

//   const handleEdit = (product) => {
//     setFormData(product);
//     setIsEditing(true);
//   };

//   const handleDelete = (productId) => {
//     setProducts(products.filter(product => product.id !== productId));
//   };

//   const handleTransaction = (e) => {
//     e.preventDefault();

//     setProducts(products.map(product => {
//       if (product.id === selectedProductId) {
//         return {
//           ...product,
//           stock: transactionType === 'buy'
//             ? product.stock + Number(transactionAmount)
//             : product.stock - Number(transactionAmount)
//         };
//       }
//       return product;
//     }));

//     // Reset transaction form
//     setSelectedProductId(null);
//     setTransactionAmount(1);
//   };

//   const filteredProducts = products.filter(product => {
//     // Apply category filter
//     if (filter !== 'all' && product.category !== filter) return false;

//     // Apply search term filter
//     if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

//     return true;
//   });

//   const categories = [...new Set(products.map(product => product.category))];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Head>
//         <title>Inventory Management | ERP System</title>
//         <meta name="description" content="Manage your product inventory" />
//       </Head>

//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Product Form Column */}
//             <div className="lg:col-span-1">
//               <div className="bg-white shadow rounded-lg p-6">
//                 <h2 className="text-lg font-medium mb-4">
//                   {isEditing ? 'Edit Product' : 'Add New Product'}
//                 </h2>
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-4">
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                         Selling Price ($)
//                       </label>
//                       <input
//                         type="number"
//                         id="price"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleInputChange}
//                         min="0"
//                         step="0.01"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
//                         Cost Price ($)
//                       </label>
//                       <input
//                         type="number"
//                         id="cost"
//                         name="cost"
//                         value={formData.cost}
//                         onChange={handleInputChange}
//                         min="0"
//                         step="0.01"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       id="category"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="mb-6">
//                     <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
//                       Initial Stock
//                     </label>
//                     <input
//                       type="number"
//                       id="stock"
//                       name="stock"
//                       value={formData.stock}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-3">
//                     {isEditing && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIsEditing(false);
//                           setFormData({
//                             id: '',
//                             name: '',
//                             description: '',
//                             price: '',
//                             cost: '',
//                             category: '',
//                             stock: 0
//                           });
//                         }}
//                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                       {isEditing ? 'Update Product' : 'Add Product'}
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {/* Stock Transaction Form */}
//               {selectedProductId && (
//                 <div className="bg-white shadow rounded-lg p-6 mt-6">
//                   <h2 className="text-lg font-medium mb-4">Update Stock</h2>
//                   <form onSubmit={handleTransaction}>
//                     <div className="mb-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Transaction Type
//                       </label>
//                       <div className="flex space-x-4">
//                         <label className="inline-flex items-center">
//                           <input
//                             type="radio"
//                             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//                             checked={transactionType === 'buy'}
//                             onChange={() => setTransactionType('buy')}
//                           />
//                           <span className="ml-2 text-gray-700">Purchase (Add Stock)</span>
//                         </label>
//                         <label className="inline-flex items-center">
//                           <input
//                             type="radio"
//                             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//                             checked={transactionType === 'sell'}
//                             onChange={() => setTransactionType('sell')}
//                           />
//                           <span className="ml-2 text-gray-700">Sale (Remove Stock)</span>
//                         </label>
//                       </div>
//                     </div>
//                     <div className="mb-4">
//                       <label htmlFor="transactionAmount" className="block text-sm font-medium text-gray-700 mb-1">
//                         Quantity
//                       </label>
//                       <input
//                         type="number"
//                         id="transactionAmount"
//                         value={transactionAmount}
//                         onChange={(e) => setTransactionAmount(e.target.value)}
//                         min="1"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div className="flex justify-end">
//                       <button
//                         type="button"
//                         onClick={() => setSelectedProductId(null)}
//                         className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                       >
//                         Process
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>

//             {/* Product List Column */}
//             <div className="lg:col-span-2">
//               <div className="bg-white shadow rounded-lg p-6">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
//                   <h2 className="text-lg font-medium">Product Inventory</h2>
//                   <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <select
//                       value={filter}
//                       onChange={(e) => setFilter(e.target.value)}
//                       className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="all">All Categories</option>
//                       {categories.map(category => (
//                         <option key={category} value={category}>{category}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Cost
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Stock
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((product) => (
//                           <tr
//                             key={product.id}
//                             className={product.stock <= product.minStock ? 'bg-red-50' : ''}
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                                   <div className="text-sm text-gray-500">{product.description}</div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900 capitalize">{product.category}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">${product.cost.toFixed(2)}</div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="text-sm text-gray-900">
//                                 {product.stock} {product.stock <= product.minStock && (
//                                   <span className="text-red-600">(Low Stock)</span>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                               <button
//                                 onClick={() => {
//                                   setSelectedProductId(product.id);
//                                   setTransactionType('buy');
//                                   setTransactionAmount(1);
//                                 }}
//                                 className="text-indigo-600 hover:text-indigo-900 mr-3"
//                               >
//                                 Stock
//                               </button>
//                               <button
//                                 onClick={() => handleEdit(product)}
//                                 className="text-yellow-600 hover:text-yellow-900 mr-3"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(product.id)}
//                                 className="text-red-600 hover:text-red-900"
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Inventory Summary */}
//                 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-blue-50 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-blue-800">Total Products</h3>
//                     <p className="text-2xl font-bold text-blue-900">{products.length}</p>
//                   </div>
//                   <div className="bg-green-50 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-green-800">Total Stock Value</h3>
//                     <p className="text-2xl font-bold text-green-900">
//                       ${products.reduce((sum, product) => sum + (product.stock * product.price), 0).toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="bg-yellow-50 p-4 rounded-lg">
//                     <h3 className="text-sm font-medium text-yellow-800">Low Stock Items</h3>
//                     <p className="text-2xl font-bold text-yellow-900">
//                       {products.filter(p => p.stock <= p.minStock).length}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
