// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import th from './locales/th.json';

// We'll expose multiple namespaces but from a single file per language.
// Keep existing t('ns:key') usage by providing resources under their namespaces.
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'th'],
    ns: [
      'common',
      'navbar',
      'aboutUs',
      'centralize',
      'communityCard',
      'contact',
      'dataCenter',
      'dataManagement',
      'digitalTransformation',
      'knowledge',
      'knowledgeDetail',
      'companyEvents',
      'society',
      'blogDetail',
      'meetingRoom',
      'multimedia',
      'networkSecurity'
    ],
    defaultNS: 'common',
    resources: {
      en,
      th,
    },
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
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
