import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useReadContract } from "wagmi";
import { ErrorReturnType, PendingReturnType } from "./types";

interface SuccessReturnType {
  status: "success";
  bio: string;
}

type UseGetBioReturnType =
  | SuccessReturnType
  | ErrorReturnType
  | PendingReturnType;

export const useGetBio = ({
  contractAddress,
}: {
  contractAddress: string | undefined;
}): UseGetBioReturnType => {
  const result = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "bio",
    query: {
      enabled: !!contractAddress,
    },
  });

  if (!contractAddress) {
    return {
      status: "error",
      errorMessage: "Contract address is undefined",
    };
  }

  if (result.status === "error") {
    return {
      status: "error",
      errorMessage: result.error.message,
    };
  }

  if (result.status === "pending") {
    return {
      status: "pending",
    };
  }

  return {
    status: "success",
    bio: result.data,
  };
};
