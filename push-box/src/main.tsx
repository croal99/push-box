import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./hooks/networkConfig.ts";

import "@/styles/globals.css";

const queryClient = new QueryClient();
console.log(import.meta.env)

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <Theme
        appearance="dark"
        accentColor="grass"
    >
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
          <WalletProvider autoConnect>
              <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  // </React.StrictMode>,
);
