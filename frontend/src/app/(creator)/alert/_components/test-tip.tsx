import { EduStreamrAbi } from "@/abi/EduStreamr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import { useTxHash } from "@/hooks/use-tx-hash";
import { config } from "@/wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BaseError, useAccount, useWriteContract } from "wagmi";
import { TxButton } from "../../_components/tx-button";

export const TestTip = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { txHash, setTxHashWithTimeout } = useTxHash();

  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const { writeContract } = useWriteContract();

  if (
    creatorInfoResult.status === "pending" ||
    creatorInfoResult.status === "error"
  )
    return null;

  const handleTestTip = () => {
    setIsLoading(true);

    writeContract(
      {
        abi: EduStreamrAbi,
        address: creatorInfoResult.contractAddress,
        functionName: "sendTestTip",
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });

          setTxHashWithTimeout(data);

          toast.success("Test tip sent");

          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(
            (error as BaseError).details ||
              "Failed to send test tip. See console for detailed error."
          );

          console.error(error.message);

          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>Send Test Tip</CardTitle>
        <CardDescription>
          Send a test tip to check if it appears on-screen. This action requires
          a small transaction fee (~0.0001 EDU).
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-grow flex items-end">
        <TxButton
          isLoading={isLoading}
          txHash={txHash}
          icon={Send}
          text="Send"
          onClick={handleTestTip}
        />
      </CardFooter>
    </Card>
  );
};
