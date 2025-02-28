import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useReadContract } from "wagmi";
import { ErrorReturnType, PendingReturnType } from "./types";

interface SuccessReturnType {
  status: "success";
  duration: number;
}

type UseGetDurationReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

export const useGetDuration = ({
  contractAddress,
}: {
  contractAddress?: string;
}): UseGetDurationReturnType => {
  const result = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "messageDuration",
    query: {
      enabled: !!contractAddress,
    },
  });

  if (result.status === "pending") {
    return { status: "pending" };
  }

  if (result.status === "error") {
    return { status: "error", errorMessage: result.error.message };
  }

  return { status: "success", duration: result.data };
};
