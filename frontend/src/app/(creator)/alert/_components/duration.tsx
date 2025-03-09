import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import toast from "react-hot-toast";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { Save } from "lucide-react";
import { useTxHash } from "@/hooks/use-tx-hash";
import { TxButton } from "../../_components/tx-button";

export const Duration = ({
  currentDuration,
  contractAddress,
}: {
  currentDuration: number;
  contractAddress?: string;
}) => {
  const [duration, setDuration] = useState(currentDuration);
  const [isLoading, setIsLoading] = useState(false);

  const { txHash, setTxHashWithTimeout } = useTxHash();

  const { writeContract } = useWriteContract();

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value, min, max } = event.target;

    let newValue = Math.max(Number(min), Math.min(Number(max), Number(value)));

    setDuration(newValue);
  };

  const handleSaveDuration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contractAddress) {
      toast.error("Contract address is missing");
      return;
    }

    setIsLoading(true);

    writeContract(
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "setMessageDuration",
        args: [duration],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, {
            hash: data,
          });

          setTxHashWithTimeout(data);

          toast.success("Duration updated successfully");

          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(
            (error as BaseError).details ||
              "Failed to update duration. See console for detailed error."
          );

          console.error(error.message);

          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duration</CardTitle>
        <CardDescription>
          Set the duration of a tip message displayed on-screen (in seconds).
          This action requires a small transaction fee (~0.0001 EDU).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col items-start gap-4"
          onSubmit={handleSaveDuration}
        >
          <Input
            placeholder="Duration"
            autoComplete="off"
            min={1}
            max={120}
            type="number"
            required
            onChange={handleDurationChange}
            value={duration}
          />
          <TxButton
            isLoading={isLoading}
            txHash={txHash}
            icon={Save}
            text="Save"
          />
        </form>
      </CardContent>
    </Card>
  );
};
