import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.tsx";
import AppRoutes from "./Routes";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./wagmi";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppRoutes />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);