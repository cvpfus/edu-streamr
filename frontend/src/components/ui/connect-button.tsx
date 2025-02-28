"use client";

import { inAppWallet, createWallet } from "thirdweb/wallets";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { client } from "@/client";
import { thirdwebEduchainTestnet } from "@/constants";
import { useReconnect, useDisconnect } from "wagmi";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "passkey"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  createWallet("com.binance"),
  createWallet("com.bitget.web3"),
];

export const ConnectButton = () => {
  const { reconnect } = useReconnect();
  const { disconnect } = useDisconnect();

  return (
    <ThirdwebConnectButton
      wallets={wallets}
      client={client}
      connectButton={{ style: { backgroundColor: "#209bb9", color: "white" } }}
      chain={thirdwebEduchainTestnet}
      onConnect={() => reconnect()}
      onDisconnect={() => disconnect()}
    />
  );
};
