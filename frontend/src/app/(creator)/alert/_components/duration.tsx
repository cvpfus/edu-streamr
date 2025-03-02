import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { useWriteContract } from "wagmi";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import toast from "react-hot-toast";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { Loader2, Save } from "lucide-react";

export const Duration = ({
  currentDuration,
  contractAddress,
}: {
  currentDuration: number;
  contractAddress?: string;
}) => {
  const [duration, setDuration] = useState(currentDuration);
  const [isLoading, setIsLoading] = useState(false);

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
        onSettled: () => {
          setIsLoading(false);
        },
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, {
            hash: data,
          });

          toast.success("Duration updated successfully");
        },
        onError: (error) => {
          toast.error(
            "Failed to update duration. See console for detailed error."
          );

          console.error(error.message);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duration</CardTitle>
        <CardDescription>
          Set the duration of a tip message displayed on-screen (in seconds). This action requires a small
          transaction fee (~0.0001 EDU).
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
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            <span>Save</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
