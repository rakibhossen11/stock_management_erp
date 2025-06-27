// app/(protected)/products/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX } from 'react-icons/fi';
import { useProducts } from '@/app/providers/ProductContext';
import toast from 'react-hot-toast';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { currentProduct, loading, error, getProduct, updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state - matches your create page structure
  const [product, setProduct] = useState({
    name: '',
    productCode: '',
    description: '',
    category: '',
    provider: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    reorderLevel: '',
    unit: 'pcs',
    taxRate: 0,
    barcode: '',
    images: []
  });

  // Fetch product data
  useEffect(() => {
    if (params.id) {
      getProduct(params.id);
    }
  }, [params.id]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (currentProduct) {
      setProduct({
        name: currentProduct.name,
        productCode: currentProduct.productCode,
        description: currentProduct.description || '',
        category: currentProduct.category || '',
        provider: currentProduct.provider || '',
        purchasePrice: currentProduct.purchasePrice || '',
        sellingPrice: currentProduct.sellingPrice || '',
        stock: currentProduct.stock || '',
        reorderLevel: currentProduct.reorderLevel || '',
        unit: currentProduct.unit || 'pcs',
        taxRate: currentProduct.taxRate || 0,
        barcode: currentProduct.barcode || '',
        images: currentProduct.images || []
      });
    }
  }, [currentProduct]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await updateProduct(params.id, product);
      
      toast.success('Product updated successfully');
      router.push(`/products/view/${params._id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload (matches your create page)
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

  // Remove image (matches your create page)
  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  if (!currentProduct) return <div className="container mx-auto px-4 py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={() => router.push(`/products/${params.id}`)}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Product
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
                  className="w-full border rounded-md p-2 bg-gray-100"
                  value={product.productCode}
                  readOnly
                  disabled
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
                    value={product.stock}
                    onChange={(e) => setProduct({...product, stock: e.target.value})}
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
                    src={image.url || image} // Handle both file objects and strings
                    alt={image.name || `Product image ${index + 1}`} 
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
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              Add More Images
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
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => router.push(`/products/view/${params._id}`)}
            className="px-4 py-2 border rounded-md mr-4 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isSubmitting}
          >
            <FiSave className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}