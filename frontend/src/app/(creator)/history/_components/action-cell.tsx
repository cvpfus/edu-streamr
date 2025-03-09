import { Button } from "@/components/ui/button";
import { type Row } from "@tanstack/react-table";
import { Loader2, Zap } from "lucide-react";
import { type History } from "../columns";
import { BaseError, useAccount, useWriteContract } from "wagmi";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import { UniversalEduStreamrAddress } from "@/constants";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { useState } from "react";
import { config } from "@/wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

export const ActionCell = ({ row }: { row: Row<History> }) => {
  const accountResult = useAccount();

  const isRegisteredResult = useIsRegistered(accountResult.address);

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const { writeContract } = useWriteContract();

  const [isLoading, setIsLoading] = useState(false);

  const { original } = row;
  const { senderName, amount, message } = original;

  if (
    isRegisteredResult.status === "pending" ||
    creatorInfoResult.status === "pending"
  ) {
    return <Loader2 className="animate-spin" />;
  }

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined;

  const handleTrigger = () => {
    setIsLoading(true);

    if (isRegisteredResult.data) {
      if (!contractAddress) {
        setIsLoading(false);
        toast.error("Contract address is undefined");
        return;
      }

      writeContract(
        {
          address: contractAddress,
          abi: EduStreamrAbi,
          functionName: "emitTipEvent",
          args: [senderName, message, parseEther(amount)],
        },
        {
          onSuccess: async (data) => {
            await waitForTransactionReceipt(config, {
              hash: data,
            });

            toast.success("Tip triggered successfully");

            setIsLoading(false);
          },
          onError: (error) => {
            toast.error(
              (error as BaseError).details ||
                "Failed to trigger tip. See console for detailed error."
            );

            console.error(error.message);

            setIsLoading(false);
          },
        }
      );
    } else {
      if (!accountResult.address) {
        setIsLoading(false);
        toast.error("Account address is undefined");
        return;
      }

      writeContract(
        {
          address: UniversalEduStreamrAddress,
          abi: UniversalEduStreamrAbi,
          functionName: "emitTipEvent",
          args: [
            accountResult.address,
            senderName,
            message,
            parseEther(amount),
          ],
        },
        {
          onSuccess: async (data) => {
            await waitForTransactionReceipt(config, {
              hash: data,
            });

            toast.success("Tip triggered successfully");

            setIsLoading(false);
          },
          onError: (error) => {
            toast.error(
              (error as BaseError).details ||
                "Failed to trigger tip. See console for detailed error."
            );

            console.error(error.message);

            setIsLoading(false);
          },
        }
      );
    }
  };

  return (
    <Button
      onClick={handleTrigger}
      className="flex gap-2 items-center"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Zap />}
      <span className="hidden sm:inline">Trigger</span>
    </Button>
  );
};
