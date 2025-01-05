import { defineChain } from "viem";

export const EduStreamrFactoryAddress =
  "0x9aDa1356126969D051db05A90d9fE3a08919BB1C";

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
