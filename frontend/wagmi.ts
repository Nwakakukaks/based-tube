import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// Replace this with your actual environment variable import method for Vite
const VITE_WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;

const projectId = VITE_WC_PROJECT_ID || '1cb585a69298ab4343bf1678b1efdded';

if (!projectId) {
  const providerErrMessage =
    'To connect to all Wallets you need to provide a VITE_WC_PROJECT_ID env variable';
  throw new Error(providerErrMessage);
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended Wallet',
      wallets: [coinbaseWallet],
    },
    {
      groupName: 'Other Wallets',
      wallets: [rainbowWallet, metaMaskWallet],
    },
  ],
  {
    appName: 'SuperBase',
    projectId,
  },
);

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});