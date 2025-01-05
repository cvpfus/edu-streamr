import { defineChain } from "viem";

export const EduStreamrFactoryAddress =
  "0xe173B196D102B68FF5c13F7FD2A6ee133D17e7a3";

export const educhainTestnet = defineChain({
  id: 656476,
  name: "EduChain Testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
  },
  nativeCurrency: {
    name: "EduChain",
    symbol: "EDU",
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "EduChain Testnet Explorer",
      url: "https://edu-chain-testnet.blockscout.com",
    },
  },
});
