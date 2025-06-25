'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.productCode}`);
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch product');
        }
        
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.productCode]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${params.productCode}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product');
      }
      
      router.push('/products');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex space-x-2">
            <Link 
              href={`/products/edit/${product.code}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <Link 
              href="/products"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Product Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Code:</span> {product.code}</p>
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Provider:</span> {product.provider}</p>
              <p><span className="font-medium">Description:</span> {product.description}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Pricing & Inventory</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Purchase Price:</span> ${product.purchasePrice}</p>
              <p><span className="font-medium">Selling Price:</span> ${product.sellingPrice}</p>
              <p><span className="font-medium">In Stock:</span> {product.inStock} {product.unit}</p>
              <p><span className="font-medium">Reorder Level:</span> {product.reorderLevel}</p>
              <p><span className="font-medium">Tax Rate:</span> {product.taxRate}%</p>
            </div>
          </div>
        </div>
        
        {product.images?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Images</h2>
            <div className="flex flex-wrap gap-4">
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}