import "../styles/globals.css";
import type { AppProps } from "next/app";
import FileProvider from "../components/FileProvider";
import ThemeManager from "../components/ThemeManager";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FileProvider>
      <ThemeManager>
        <Component {...pageProps} />
      </ThemeManager>
    </FileProvider>
  );
}

export default MyApp;
