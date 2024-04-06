
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */

// const { i18n } = import ('./next-i18next.config.ts')

const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n:{
    defaultLocale: "en",
    locales: ["en","ar","zh","es","hi","bn","ru","ja","vi","tr"],
},
  images:{
    domains:['ik.imagekit.io','img.clerk.com','mwalwguokneuerlhutpf.supabase.co']
  },
  env:{
    // @ts-ignore
    BASE_URL:process.env.BASE_URL,
  }
};


// import withBundleAnalyzer from '@next/bundle-analyzer';

// const bundleAnalyzerConfig = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
//   // other options
// });

// export default bundleAnalyzerConfig({config})

export default config;

