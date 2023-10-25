import "@/styles/globals.css";
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
