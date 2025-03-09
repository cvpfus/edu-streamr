import { useReadContract } from "wagmi";
import { ErrorReturnType, PendingReturnType } from "./types";
import { FaucetContractAddress } from "@/constants";

interface SuccessReturnType {
  status: "success";
  hasClaimed: boolean;
}

type UseHasClaimedReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

export const useHasClaimed = (
  address: string | undefined
): UseHasClaimedReturnType => {
  const result = useReadContract({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "hasClaimed",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: FaucetContractAddress,
    functionName: "hasClaimed",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  if (!address) {
    return { status: "error", errorMessage: "Address is required" };
  }

  if (result.status === "pending") {
    return { status: "pending" };
  }

  if (result.status === "error") {
    return { status: "error", errorMessage: result.error.message };
  }

  return { status: "success", hasClaimed: result.data };
};
