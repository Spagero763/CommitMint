"use client";

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'PoC NFT',
  // Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2
  // https://www.rainbowkit.com/docs/installation#configure
  // Using a default public project ID from WalletConnect examples
  // https://github.com/WalletConnect/walletconnect-examples/blob/main/dapps/react-dapp-v2/src/constants/env.ts
  projectId: "21fef48091f12692cad574a6f874a2e2",
  chains: [baseSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#673AB7',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
