import "../styles/globals.css";
import type { AppProps } from "next/app";
import FileProvider from "../components/FileProvider";
import dynamic from "next/dynamic";

const ThemeManager = dynamic(() => import("../components/ThemeManager"), {
  ssr: false,
});

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
