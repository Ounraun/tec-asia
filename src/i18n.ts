import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)                // โหลด JSON ผ่าน HTTP
  .use(initReactI18next)       // connect กับ React
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'th'],
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    react: { useSuspense: false }
  });

export default i18n;
