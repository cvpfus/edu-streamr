import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { useReadContract } from "wagmi";
import { ErrorReturnType, PendingReturnType } from "./types";
import { formatEther } from "viem";

type Tips = readonly {
  senderAddress: string;
  senderName: string;
  message: string;
  amount: string;
  timestamp: string;
}[];

interface SuccessReturnType {
  status: "success";
  paginatedTips: Tips;
  tipLength: bigint;
}

type UseGetUniversalTipHistoryReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

interface UseGetUniversalTipHistoryProps {
  creatorAddress?: string;
  contractAddress: string;
  pageIndex: number;
  pageSize: number;
}

export const useGetUniversalTipHistory = ({
  creatorAddress,
  contractAddress,
  pageIndex,
  pageSize,
}: UseGetUniversalTipHistoryProps): UseGetUniversalTipHistoryReturnType => {
  const result = useReadContract({
    abi: UniversalEduStreamrAbi,
    address: contractAddress,
    functionName: "getTipHistory",
    query: {
      enabled: !!creatorAddress,
    },
    args: [creatorAddress!, BigInt(pageIndex), BigInt(pageSize)],
  });

  if (result.status === "error") {
    return { status: "error", errorMessage: result.error.message };
  }

  if (result.status === "pending") {
    return { status: "pending" };
  }

  return {
    status: "success",
    paginatedTips: result.data[0].map((tip) => ({
      ...tip,
      timestamp: new Date(Number(tip.timestamp) * 1000).toLocaleString(),
      amount: formatEther(tip.amount),
    })),
    tipLength: result.data[1],
  };
};
