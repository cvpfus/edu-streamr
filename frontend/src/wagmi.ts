import { createConfig, webSocket } from "wagmi";
import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
import { educhainTestnet } from "./constants";
import { client } from "./client";

export const networks = [educhainTestnet];

export const config = createConfig({
  chains: [educhainTestnet],
  connectors: [inAppWalletConnector({ client })],
  transports: {
    [educhainTestnet.id]: webSocket(
      "wss://ws.open-campus-codex.gelato.digital",
      {
        retryCount: 20,
      }
    ),
  },
});

config.storage?.setItem("tw.lastChainId", educhainTestnet.id);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
