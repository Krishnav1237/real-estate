import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'Missing VITE_WALLET_CONNECT_PROJECT_ID. Please add it to your .env file. Get one at https://cloud.walletconnect.com'
  );
}

const { connectors } = getDefaultWallets({
  appName: 'Real Estate Tokenization',
  projectId
});

export const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`),
  },
});

export { sepolia as chain }; 