"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "@/wagmi";
import {
  InfiniteRowModelModule,
  PaginationModule,
  ModuleRegistry,
} from "ag-grid-community";
import { ThirdwebProvider } from "thirdweb/react";

ModuleRegistry.registerModules([InfiniteRowModelModule, PaginationModule]);

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => wagmiConfig);
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}
