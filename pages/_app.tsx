import "../styles/globals.css";
import type { AppProps } from "next/app";
import FileProvider from "../components/FileProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FileProvider>
      <Component {...pageProps} />
    </FileProvider>
  );
}

export default MyApp;
