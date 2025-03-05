"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { config as wagmiConfig } from "@/wagmi";
import { ThirdwebProvider } from "thirdweb/react";
import { ColorProvider } from "@/components/color-provider";

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
          <ColorProvider>{props.children}</ColorProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}
