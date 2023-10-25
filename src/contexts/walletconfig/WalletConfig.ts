import {
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  fantom,
  fantomTestnet,
} from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { uniswapWallet, stargazerWallet } from "./customwallets";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, fantom, fantomTestnet],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_ID
        ? process.env.NEXT_PUBLIC_INFURA_ID
        : "",
    }),
    publicProvider(),
  ]
);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
  ? process.env.NEXT_PUBLIC_PROJECT_ID
  : "";

const connectors = connectorsForWallets([
  ...getDefaultWallets({
    appName: "SURVIVERSE_NFT",
    projectId: projectId,
    chains,
  }).wallets,
  {
    groupName: "Recommended",
    wallets: [
      uniswapWallet({ chains, projectId }),
      stargazerWallet({ chains, projectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains, wagmiConfig };
