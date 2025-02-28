import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import "dotenv/config";

const TESTNET_PRIVATE_KEY = vars.get("TESTNET_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    educhainTestnet: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      accounts: [TESTNET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      educhainTestnet: "just-random-api-key",
    },
    customChains: [
      {
        network: "educhainTestnet",
        chainId: 656476,
        urls: {
          apiURL: "https://edu-chain-testnet.blockscout.com/api",
          browserURL: "https://edu-chain-testnet.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
