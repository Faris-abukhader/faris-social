// eslint-disable-next-line @typescript-eslint/no-var-requires
const path =  require('path');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: ["en","ar","zh","es","hi","bn","ru","ja","vi","tr"],
        localePath: path.resolve('./public/locales')
    },
    
  }