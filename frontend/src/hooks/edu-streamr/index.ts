import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useReadContract, useReadContracts } from "wagmi";
import { EduStreamrFactoryAbi } from "@/abi/EduStreamrFactory";
import { EduStreamrFactoryAddress } from "@/constants";
import {
  UseGetAllTipsReturnType,
  UseGetCreatorInfoReturnType,
  UseGetStatsReturnType,
  UseGetTipHistory2ReturnType,
  UseGetTipHistoryReturnType,
} from "./types";

export const useGetAllTips = (
  contractAddress: `0x${string}`
): UseGetAllTipsReturnType => {
  const result = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "getAllTips",
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
      tips: [],
    };
  }

  return {
    status: "success",
    tips: result.data,
  };
};

export const useGetTipHistory = ({
  contractAddress,
  page,
  pageSize,
}: {
  contractAddress: `0x${string}`;
  page: number;
  pageSize: number;
}): UseGetTipHistoryReturnType => {
  const tipHistory = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "getTipHistory",
    args: [BigInt(page), BigInt(pageSize)],
  });

  const tipLength = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "getTotalTips",
  });

  if (tipHistory.status === "error") {
    return {
      status: "error",
      errorMessage: tipHistory.error.message,
    };
  }

  if (tipLength.status === "error") {
    return {
      status: "error",
      errorMessage: tipLength.error.message,
    };
  }

  if (tipHistory.status === "pending" || tipLength.status === "pending") {
    return {
      status: "success",
      paginatedTips: [],
      tipLength: BigInt(0),
    };
  }

  return {
    status: "success",
    paginatedTips: tipHistory.data,
    tipLength: tipLength.data,
  };
};

export const useGetTipHistory2 = ({
  contractAddress,
  startRow,
  endRow,
}: {
  contractAddress: `0x${string}`;
  startRow: number;
  endRow: number;
}): UseGetTipHistory2ReturnType => {
  const tipHistory = useReadContract({
    abi: EduStreamrAbi,
    address: contractAddress,
    functionName: "getTipHistory2",
    args: [BigInt(startRow), BigInt(endRow)],
  });

  if (tipHistory.status === "error") {
    return {
      status: "error",
      errorMessage: tipHistory.error.message,
    };
  }

  if (tipHistory.status === "pending") {
    return {
      status: "success",
      paginatedTips: [],
      tipLength: BigInt(0),
    };
  }

  return {
    status: "success",
    paginatedTips: tipHistory.data[0],
    tipLength: tipHistory.data[1],
  };
};

export const useGetCreatorInfoByAddress = (
  address: `0x${string}`
): UseGetCreatorInfoReturnType => {
  const result = useReadContract({
    abi: EduStreamrFactoryAbi,
    address: EduStreamrFactoryAddress,
    functionName: "creatorInfoByAddress",
    args: [address],
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
    creatorAddress: result.data[1],
    contractAddress: result.data[2],
  };
};

export const useGetCreatorInfoByUsername = (
  username: string
): UseGetCreatorInfoReturnType => {
  const result = useReadContract({
    abi: EduStreamrFactoryAbi,
    address: EduStreamrFactoryAddress,
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
    creatorAddress: result.data[1],
    contractAddress: result.data[2],
  };
};

export const useGetCreatorStats = (
  contractAddress: `0x${string}` | undefined
): UseGetStatsReturnType => {
  const result = useReadContracts({
    contracts: [
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "getTotalTips",
      },
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "totalTipsReceived",
      },
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "bio",
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
    totalTippers:
      result.data[0].status === "success" ? result.data[0].result : BigInt(0),
    totalTipsReceived:
      result.data[1].status === "success" ? result.data[1].result : BigInt(0),
    bio: result.data[2].status === "success" ? result.data[2].result : "",
  };
};
