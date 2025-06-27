'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/app/providers/ProductContext';
import { FiTrash2 } from 'react-icons/fi';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id; // Now safe to access
  console.log(id);
  const { currentProduct, getProduct, deleteProduct, loading, error, } = useProducts();
  const router = useRouter();
  const product = currentProduct;
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // console.log(params);
  console.log(currentProduct);

  // Fetch product on mount and when ID changes
  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id]);

  const handleConfirm = async () => {
    // console.log(id);
    deleteProduct(id);
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
              href={`/products/edit/${product._id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              <FiTrash2 size={16} />
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
              <p><span className="font-medium">Code:</span> {product.productCode}</p>
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
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <div className="flex items-center gap-2">
                {/* <FiAlertTriangle className="text-red-500" size={20} /> */}
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1"
                disabled={isDeleting}
              >
                
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              
              <p className="mt-4 text-sm text-red-600">
                This action cannot be undone. All related data will be permanently removed.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2"
                disabled={isDeleting}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}