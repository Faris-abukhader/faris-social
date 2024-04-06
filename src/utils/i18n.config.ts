import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../public/locales/en/common.json";
import ar from "../../public/locales/ar/common.json";
import zh from "../../public/locales/zh/common.json";

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
      zh:{
        translation:zh
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

