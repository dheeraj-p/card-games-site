import Head from 'next/head';
import '../global_styles/style.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>All Games | QuickGame.io</title>
        <meta name="description" property="og:description" content="All Games | QuickGame.io" />
        <meta name="title" property="og:title" content="All Games | QuickGame.io" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
