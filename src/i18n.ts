import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)               
  .use(initReactI18next)     
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'th'],
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    react: { useSuspense: false }
  }).then(() => {
    // ตั้งค่าเริ่มต้นให้ <html> มี lang ปัจจุบัน
    document.documentElement.lang = i18n.language;
  });
  
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});
export default i18n;
