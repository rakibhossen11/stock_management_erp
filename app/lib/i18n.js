import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      createNewProduct: 'Create New Product',
      productName: 'Product Name',
      description: 'Description',
      price: 'Price',
      stockQuantity: 'Stock Quantity',
      category: 'Category',
      activeProduct: 'Active Product',
      createProduct: 'Create Product',
      creating: 'Creating...',
      nameRequired: 'Product name is required',
      descriptionRequired: 'Description is required',
      priceRequired: 'Price is required',
      priceMustBePositive: 'Price must be positive',
      stockRequired: 'Stock quantity is required',
      stockMustBePositive: 'Stock must be positive',
      categoryRequired: 'Category is required',
      productCreatedSuccessfully: 'Product created successfully!',
      productCreationFailed: 'Product creation failed',
      translateToEnglish: 'Translate to English',
      translating: 'Translating...',
    }
  },
  bn: {
    translation: {
      createNewProduct: 'নতুন পণ্য তৈরি করুন',
      productName: 'পণ্যের নাম',
      description: 'বিবরণ',
      price: 'মূল্য',
      stockQuantity: 'স্টক পরিমাণ',
      category: 'বিভাগ',
      activeProduct: 'সক্রিয় পণ্য',
      createProduct: 'পণ্য তৈরি করুন',
      creating: 'তৈরি করা হচ্ছে...',
      nameRequired: 'পণ্যের নাম প্রয়োজন',
      descriptionRequired: 'বিবরণ প্রয়োজন',
      priceRequired: 'মূল্য প্রয়োজন',
      priceMustBePositive: 'মূল্য অবশ্যই ইতিবাচক হতে হবে',
      stockRequired: 'স্টক পরিমাণ প্রয়োজন',
      stockMustBePositive: 'স্টক অবশ্যই ইতিবাচক হতে হবে',
      categoryRequired: 'বিভাগ প্রয়োজন',
      productCreatedSuccessfully: 'পণ্য সফলভাবে তৈরি হয়েছে!',
      productCreationFailed: 'পণ্য তৈরি ব্যর্থ হয়েছে',
      translateToEnglish: 'ইংরেজিতে অনুবাদ করুন',
      translating: 'অনুবাদ করা হচ্ছে...',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'bn', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;