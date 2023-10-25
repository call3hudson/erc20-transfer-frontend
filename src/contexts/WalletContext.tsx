import {
  DisclaimerComponent,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import React from "react";
import { WagmiConfig } from "wagmi";

import { chains, wagmiConfig } from "./walletconfig";

type Props = {
  children: React.ReactNode;
};

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => <></>;

const WalletProvider: React.FC<Props> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        modalSize="compact"
        chains={chains}
        appInfo={{
          appName: "RainbowKit Demo",
          disclaimer: Disclaimer,
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletProvider;
