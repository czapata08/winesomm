/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/github",
  //       destination: "https://github.com/Nutlope/twitterbio",
  //       permanent: false,
  //     },
  //     {
  //       source: "/deploy",
  //       destination: "https://vercel.com/templates/next.js/twitter-bio",
  //       permanent: false,
  //     },
  //   ];
  // },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
  },
};
