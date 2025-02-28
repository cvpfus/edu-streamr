import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { useReadContract } from "wagmi";

export const useIsRegistered = (address: string | undefined) => {
  return useReadContract({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    functionName: "isRegistered",
    args: [address!],
    query: { enabled: !!address },
  });
};
