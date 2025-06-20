// app/(protected)/products/[id]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiTrash2, FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';

export default function UpdateProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [product, setProduct] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    provider: '',
    purchasePrice: 0,
    sellingPrice: 0,
    inStock: 0,
    reorderLevel: 0,
    unit: 'pcs',
    taxRate: 0,
    barcode: '',
    images: []
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        const mockProduct = {
          id: productId,
          name: 'Office Chair Deluxe',
          code: 'CHAIR-001',
          description: 'Ergonomic office chair with adjustable height and lumbar support',
          category: 'furniture',
          provider: 'Furniture World Inc.',
          purchasePrice: 80.00,
          sellingPrice: 129.99,
          inStock: 45,
          reorderLevel: 10,
          unit: 'pcs',
          taxRate: 10,
          barcode: '123456789012',
          images: [
            { url: '/chair1.jpg', name: 'chair1.jpg' },
            { url: '/chair2.jpg', name: 'chair2.jpg' }
          ]
        };
        
        setProduct(mockProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with actual API call
      console.log('Updating product:', product);
      
      // Redirect to product detail after update
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete product
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // Replace with actual API call
        console.log('Deleting product:', productId);
        router.push('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + product.images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    const newImages = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));
    
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Remove image
  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          Loading product data...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Update Product</h1>
        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <FiTrash2 className="mr-2" />
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2 border-b pb-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={product.name}
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code*</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={product.code}
                  onChange={(e) => setProduct({...product, code: e.target.value})}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 h-24"
                  value={product.description}
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Inventory Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={product.category}
                  onChange={(e) => setProduct({...product, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="office-supplies">Office Supplies</option>
                  <option value="breakroom">Breakroom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider/Supplier*</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={product.provider}
                  onChange={(e) => setProduct({...product, provider: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">In Stock*</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-md p-2"
                    value={product.inStock}
                    onChange={(e) => setProduct({...product, inStock: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border rounded-md p-2"
                    value={product.reorderLevel}
                    onChange={(e) => setProduct({...product, reorderLevel: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measurement*</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={product.unit}
                  onChange={(e) => setProduct({...product, unit: e.target.value})}
                  required
                >
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="g">Grams</option>
                  <option value="l">Liters</option>
                  <option value="m">Meters</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded-md p-2 pl-8"
                      value={product.purchasePrice}
                      onChange={(e) => setProduct({...product, purchasePrice: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border rounded-md p-2 pl-8"
                      value={product.sellingPrice}
                      onChange={(e) => setProduct({...product, sellingPrice: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border rounded-md p-2"
                  value={product.taxRate}
                  onChange={(e) => setProduct({...product, taxRate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="h-32 w-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <FiPlus className="inline mr-2" />
              Upload Images
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Maximum 5 images (JPEG, PNG)</p>
          </div>

          {/* Barcode */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Barcode</h2>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="border rounded-md p-2 flex-grow"
                placeholder="Enter barcode or scan"
                value={product.barcode}
                onChange={(e) => setProduct({...product, barcode: e.target.value})}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Scan Barcode
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isSubmitting}
          >
            <FiSave className="mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}