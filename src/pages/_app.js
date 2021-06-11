import Head from 'next/head';
import '../global_styles/style.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Free Card Games</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
