import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
}
export const Stargazer = ({ chains, projectId }: MyWalletOptions): Wallet => ({
  id: "stargazer-wallet",
  name: "Stargazer wallet",
  iconUrl:
    "https://lh3.googleusercontent.com/A5XUQHO2lRdP5ahUWkHZ6fePVvlYilP-LEwC5Tjqq08LelTi7R7zRauA-boUPgE44ghMRuSeg9TIrQT5CvJUWZv0M5g=w128-h128-e365-rj-sc0x00ffffff",
  iconBackground: "#ffffff",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=com.stargazer&hl=en_US&gl=US",
    ios: "https://apps.apple.com/us/app/stargazer-wallet/id1612326452",
    chrome:
      "https://chrome.google.com/webstore/detail/stargazer-wallet/pgiaagfkgcbnmiiolekcfmljdagdhlcm",
    qrCode: "https://my-wallet/qr",
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ projectId, chains });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const provider = await connector.getProvider();
          const uri = await new Promise<string>((resolve) =>
            provider.once("display_uri", resolve)
          );
          return uri;
        },
      },
      qrCode: {
        getUri: async () => {
          const provider = await connector.getProvider();
          const uri = await new Promise<string>((resolve) =>
            provider.once("display_uri", resolve)
          );
          return uri;
        },
        instructions: {
          learnMoreUrl: "https://my-wallet/learn-more",
          steps: [
            {
              description:
                "We recommend putting My Wallet on your home screen for faster access to your wallet.",
              step: "install",
              title: "Open the My Wallet app",
            },
            {
              description:
                "After you scan, a connection prompt will appear for you to connect your wallet.",
              step: "scan",
              title: "Tap the scan button",
            },
          ],
        },
      },
      extension: {
        instructions: {
          learnMoreUrl: "https://my-wallet/learn-more",
          steps: [
            {
              description:
                "We recommend pinning My Wallet to your taskbar for quicker access to your wallet.",
              step: "install",
              title: "Install the My Wallet extension",
            },
            {
              description:
                "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
              step: "create",
              title: "Create or Import a Wallet",
            },
            {
              description:
                "Once you set up your wallet, click below to refresh the browser and load up the extension.",
              step: "refresh",
              title: "Refresh your browser",
            },
          ],
        },
      },
    };
  },
});
