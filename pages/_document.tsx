import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='icon'
            href='/favicon.ico'
          />
          <meta
            name='description'
            content='Your Personal AI Wine Advisor'
          />
          <meta
            property='og:site_name'
            content='winebot'
          />
          <meta
            property='og:description'
            content='Your Personal AI Wine Advisor'
          />
          <meta
            property='og:title'
            content='AI Winebot'
          />
          <meta
            name='winebot:card'
            content='summary_large_image'
          />
          <meta
            name='winebot'
            content='AI Winebot'
          />
          <meta
            name='winebot: description'
            content='Become A Wine Expert In Seconds'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
