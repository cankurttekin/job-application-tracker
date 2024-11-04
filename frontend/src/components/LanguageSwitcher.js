const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('tr')}>Türkçe</button>
    </div>
  );
};

export default LanguageSwitcher;
