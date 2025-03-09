import { EduStreamrAbi } from "@/abi/EduStreamr";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { defineChain } from "viem";
import {
  getContract as thirdwebGetContract,
  defineChain as thirdwebDefineChain,
} from "thirdweb";
import { client } from "@/client";

export const UniversalEduStreamrAddress =
  "0x17140e742383371a5f06f4bfa346e551e91e4772";

export const FaucetContractAddress =
  "0x7bb20dc7faee1b154763156fb4d597ca4c0e01a5";

export const EXPLORER_TX_BASE_URL =
  "https://edu-chain-testnet.blockscout.com/tx";

export const educhainTestnet = defineChain({
  id: 656476,
  name: "EDU Chain Testnet",
  testnet: true,
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

export const thirdwebEduchainTestnet = thirdwebDefineChain(educhainTestnet);

export const getContract = (
  address: string,
  abi: typeof EduStreamrAbi | typeof UniversalEduStreamrAbi
) => {
  return thirdwebGetContract({
    chain: thirdwebEduchainTestnet,
    address,
    abi,
    client,
  });
};
