import { useRouter } from 'next/router';
import useTranslation from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  active: true,
  createdAt: '2023-05-15'
};

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/products/${mockProduct.id}/edit`);
  };

  const handleBack = () => {
    router.push('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('productDetails')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-500 hover:text-blue-700 mr-4"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t('back')}
        </button>
        <button
          onClick={handleEdit}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
        >
          {t('edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('basicInformation')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('productCode')}</p>
              <p className="mt-1">{mockProduct.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('category')}</p>
              <p className="mt-1">{mockProduct.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('price')}</p>
              <p className="mt-1">${mockProduct.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('cost')}</p>
              <p className="mt-1">${mockProduct.cost.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">{t('description')}</p>
              <p className="mt-1">{mockProduct.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('inventoryInformation')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('currentStock')}</p>
              <p className="mt-1">{mockProduct.stock}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('reorderLevel')}</p>
              <p className="mt-1">{mockProduct.reorderLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('createdAt')}</p>
              <p className="mt-1">{mockProduct.createdAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('stockStatus')}</p>
              <span
                className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  mockProduct.stock <= mockProduct.reorderLevel
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {mockProduct.stock <= mockProduct.reorderLevel
                  ? t('lowStock')
                  : t('inStock')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;