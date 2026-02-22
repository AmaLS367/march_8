import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';
import hy from './locales/hy.json';

const STORAGE_KEY = 'app-locale';

const savedLng = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLng = savedLng && ['ru', 'en', 'hy'].includes(savedLng) ? savedLng : 'ru';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    hy: { translation: hy },
  },
  lng: initialLng,
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
