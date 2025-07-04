"use client";
// contexts/ProductContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    console.log(id);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setCurrentProduct(data.data);
        return data.data;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    console.log(productData);
    const toastId = toast.loading("Creating product...");
    setIsSubmitting(true);

  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // API call to create product
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    // Show success notification
    toast.success("Product created successfully!", { id: toastId });

    // Reset form or redirect after success
    // Option 1: Reset form
    // setProduct({ name: '', price: '', category: '', supplier: '' });
    
    // Option 2: Redirect to products list
    router.push('/products');
    
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error(error.message || 'Failed to create product', { id: toastId });
  } finally {
    setIsSubmitting(false);
  }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map((p) => (p._id === id ? data.data : p)));
        setCurrentProduct(data.data);
        return data.data;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    console.log(id);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        setCurrentProduct(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//   create invoice
const createInvoice = async(invoiceData) =>{
    try {
        console.log(invoiceData);
        const res = await fetch(`/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });
    } catch (error) {
        
    }
}

// create a new category 
const createCategory = async(category) =>{
  try {
    console.log(category);
    const res = await fetch(`/api/products/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });
  } catch (error) {
    
  }
}

//   fetch all Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// create a new category 
const createSupplier = async(supplier) =>{
  try {
    console.log(supplier);
    const res = await fetch(`/api/products/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
    });
  } catch (error) {
    
  }
}

//   fetch all Suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/suppliers");
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        suppliers,
        currentProduct,
        loading,
        error,
        fetchProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        createInvoice,
        createCategory,
        createSupplier,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
