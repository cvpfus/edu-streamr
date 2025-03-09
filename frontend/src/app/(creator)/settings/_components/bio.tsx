import { EduStreamrAbi } from "@/abi/EduStreamr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTxHash } from "@/hooks/use-tx-hash";
import { config } from "@/wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BaseError, useWriteContract } from "wagmi";
import { TxButton } from "../../_components/tx-button";

export default function Bio({
  bio,
  contractAddress,
}: {
  bio: string;
  contractAddress: string | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { txHash, setTxHashWithTimeout } = useTxHash();

  const [value, setValue] = useState(bio);

  const { writeContract } = useWriteContract();

  const handleSetBio = () => {
    setIsLoading(true);

    if (!contractAddress) {
      toast.error("Contract address is undefined");
      return;
    }

    writeContract(
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "setBio",
        args: [value],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });

          setTxHashWithTimeout(data);

          toast.success("Bio set");

          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(
            (error as BaseError).details ||
              "Failed set bio. See console for detailed error."
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
        <CardTitle>Set bio</CardTitle>
        <CardDescription>
          Set your bio to be displayed on the tip page. This action requires a
          small transaction fee (~0.0001 EDU).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Textarea
            maxLength={130}
            placeholder="Enter your bio"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <p className="text-xs text-gray-500">{value.length} / 130</p>
          <TxButton
            isLoading={isLoading}
            txHash={txHash}
            icon={Save}
            text="Save"
            onClick={handleSetBio}
          />
        </div>
      </CardContent>
    </Card>
  );
}
