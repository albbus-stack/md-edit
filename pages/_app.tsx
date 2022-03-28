import "../styles/globals.css";
import type { AppProps } from "next/app";
import FileProvider from "../components/FileProvider";
import dynamic from "next/dynamic";
import Head from "next/head";

const ThemeManager = dynamic(() => import("../components/ThemeManager"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>md-edit</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/images/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <FileProvider>
        <ThemeManager>
          <Component {...pageProps} />
        </ThemeManager>
      </FileProvider>
    </>
  );
}

export default MyApp;
