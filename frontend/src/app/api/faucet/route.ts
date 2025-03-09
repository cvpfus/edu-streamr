import { educhainTestnet, FaucetContractAddress } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import { createThirdwebClient, getUser } from "thirdweb";
import { BaseError, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: educhainTestnet,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: educhainTestnet,
  transport: http(),
});

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const data = await getUser({ client, walletAddress: address });

    if (!data?.email) {
      return NextResponse.json(
        { error: "User is not registered with Google / email" },
        { status: 400 }
      );
    }

    const hash = await walletClient.writeContract({
      address: FaucetContractAddress,
      abi,
      functionName: "transfer",
      args: [address],
      account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      txHash: receipt.transactionHash,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as BaseError).shortMessage || "Transfer failed" },
      { status: 500 }
    );
  }
}
