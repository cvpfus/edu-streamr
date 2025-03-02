import { EduStreamrAbi } from "@/abi/EduStreamr";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { defineChain } from "viem";
import {
  getContract as thirdwebGetContract,
  defineChain as thirdwebDefineChain,
} from "thirdweb";
import { client } from "@/client";

export const UniversalEduStreamrAddress =
  "0x921c89bb6b95e744129f117815b7f39af2ce8e65";

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
