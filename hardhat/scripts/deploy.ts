import hre from "hardhat";
import { educhainTestnet } from "../constants";

async function main() {
  const walletClient = (
    await hre.viem.getWalletClients({
      chain: educhainTestnet,
    })
  )[0];

  const publicClient = await hre.viem.getPublicClient({
    chain: educhainTestnet,
  });

  const { bytecode } = hre.artifacts.readArtifactSync("UniversalEduStreamr");

  const hash = await walletClient.sendTransaction({
    data: bytecode,
  });

  console.log("Hash:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 1,
  });

  console.log("Contract Address:", receipt.contractAddress);

  await hre.run("verify:verify", {
    address: receipt.contractAddress!,
    contract: "contracts/UniversalEduStreamr.sol:UniversalEduStreamr",
    constructorArguments: [],
  });
}

main().catch((error) => console.log(error.message));
