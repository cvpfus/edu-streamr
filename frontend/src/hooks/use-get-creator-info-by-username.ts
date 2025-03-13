import { useReadContract } from "wagmi";
import { ErrorReturnType, PendingReturnType } from "./types";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";

interface SuccessReturnType {
  status: "success";
  username: string;
  name: string;
  creatorAddress: string;
  contractAddress: string;
}

type UseGetCreatorInfoReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

export const useGetCreatorInfoByUsername = (
  username: string
): UseGetCreatorInfoReturnType => {
  const result = useReadContract({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    functionName: "creatorInfoByUsername",
    args: [username],
  });

  if (result.status === "error") {
    return {
      status: "error",
      errorMessage: result.error?.message,
    };
  }

  if (result.status === "pending") {
    return {
      status: "pending",
    };
  }

  if (result.data[0] === "") {
    return {
      status: "error",
      errorMessage: "Creator not found",
    };
  }

  return {
    status: "success",
    username: result.data[0],
    name: result.data[1],
    creatorAddress: result.data[2],
    contractAddress: result.data[3],
  };
};
