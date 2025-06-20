import useTranslation from "../hooks/useTranslation";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('bn')}
        className={`px-3 py-1 rounded-md ${language === 'bn' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        বাংলা
      </button>
    </div>
  );
};

export default LanguageSwitcher;