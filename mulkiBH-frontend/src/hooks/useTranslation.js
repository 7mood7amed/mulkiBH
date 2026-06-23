import { useLang } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export const useT = () => {
  const { lang } = useLang();
  const t = (key) => translations[lang][key] || key;
  return t;
};
