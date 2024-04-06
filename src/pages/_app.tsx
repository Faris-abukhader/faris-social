import { api } from "@faris/utils/api";
import Router from "next/router";
import NProgress from 'nprogress'
import "@faris/styles/globals.css";
import { useEffect } from "react";
// import i18n from "localization/config";
// import { I18nextProvider } from "next-i18next";
import useColorSchemaStore from "zustandStore/colorSchemaStore";
import { appWithTranslation } from 'next-i18next'

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done())


import { type AppProps } from "next/app";

type TProps = AppProps & {
  isMobile: boolean,
  locale: string
};

const MyApp = ({
  Component,
  pageProps,
}: TProps) => {
  const { colorSchema, getColorSchema } = useColorSchemaStore(state => state)
  useEffect(() => {
    // Apply global styles or classes based on colorSchema (e.g., using Tailwind CSS)
    document.documentElement.classList.add(getColorSchema());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorSchema]);

  return (
    // <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    // </I18nextProvider>
  );
};

const AppWrapper = appWithTranslation<TProps>(MyApp)
export default api.withTRPC(AppWrapper);