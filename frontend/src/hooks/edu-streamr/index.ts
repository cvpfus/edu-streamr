import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useReadContract, useReadContracts } from "wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { UseGetCreatorInfoReturnType, UseGetStatsReturnType } from "./types";

export const useGetCreatorInfoByAddress = (
  address: string | undefined
): UseGetCreatorInfoReturnType => {
  const result = useReadContract({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    functionName: "creatorInfoByAddress",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  if (!address) return { status: "error", errorMessage: "Address is required" };

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

export const useGetCreatorStats = (
  contractAddress: string | undefined
): UseGetStatsReturnType => {
  const result = useReadContracts({
    contracts: [
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "getTipCount",
      },
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "totalTipsReceived",
      },
    ],
    query: {
      enabled: !!contractAddress,
    },
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

  return {
    status: "success",
    tipCount:
      result.data[0].status === "success" ? result.data[0].result : BigInt(0),
    totalTipsReceived:
      result.data[1].status === "success" ? result.data[1].result : BigInt(0),
  };
};
