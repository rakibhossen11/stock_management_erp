import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ProductForm from '@/components/ProductForm';

const mockProduct = {
  id: '1',
  name: 'Premium Laptop',
  code: 'LT-1001',
  description: 'High-performance business laptop with 16GB RAM and 1TB SSD',
  category: 'Electronics',
  price: 1299.99,
  cost: 899.99,
  stock: 45,
  reorderLevel: 10,
  active: true
};

const EditProductPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Product updated:', formData);
    router.push(`/products/${mockProduct.id}`);
  };

  const handleCancel = () => {
    router.push(`/products/${mockProduct.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('edit')}</h1>
        <LanguageSwitcher />
      </div>

      <ProductForm
        initialData={mockProduct}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default EditProductPage;