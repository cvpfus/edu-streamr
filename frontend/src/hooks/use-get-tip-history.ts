import { ErrorReturnType, PendingReturnType } from "./types";
import { useReadContract } from "wagmi";
import { EduStreamrAbi } from "@/abi/EduStreamr";
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

export type UseGetTipHistoryReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

interface UseGetTipHistoryProps {
  contractAddress: string;
  pageIndex: number;
  pageSize: number;
}

export const useGetTipHistory = ({
  contractAddress,
  pageIndex,
  pageSize,
}: UseGetTipHistoryProps): UseGetTipHistoryReturnType => {
  const result = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "getTipHistory",
    args: [BigInt(pageIndex), BigInt(pageSize)],
  });

  if (result.status === "error") {
    return {
      status: "error",
      errorMessage: result.error.message,
    };
  }

  if (result.status === "pending") {
    return {
      status: "success",
      paginatedTips: [],
      tipLength: BigInt(0),
    };
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
