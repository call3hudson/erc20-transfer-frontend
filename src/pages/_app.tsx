import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WalletProvider } from "@/contexts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </main>
  );
}
