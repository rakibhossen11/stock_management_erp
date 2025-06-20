import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ProductForm from '@/components/ProductForm';

const CreateProductPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Product created:', formData);
    router.push('/products');
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('createProduct')}</h1>
        <LanguageSwitcher />
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default CreateProductPage;