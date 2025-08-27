// src/i18n.ts
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
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    react: { useSuspense: false },
  })
  .then(() => applyHtmlLang(i18n.language));

i18n.on('languageChanged', applyHtmlLang);

function applyHtmlLang(lng: string) {
  const lang = (lng || 'en').split('-')[0];
  const rtl = ['ar', 'he', 'fa', 'ur'];
  document.documentElement.lang = lang;
  document.documentElement.dir = rtl.includes(lang) ? 'rtl' : 'ltr';
}

export default i18n;
