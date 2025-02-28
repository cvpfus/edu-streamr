import { EduStreamrAbi } from "@/abi/EduStreamr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import toast from "react-hot-toast";
import { Loader2, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { useGetBio } from "@/hooks/use-get-bio";
import { UseGetCreatorInfoReturnType } from "@/hooks/edu-streamr/types";

export default function Bio({
  creatorInfoResult,
}: {
  creatorInfoResult: UseGetCreatorInfoReturnType;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const accountResult = useAccount();

  const bioResult = useGetBio({
    contractAddress:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
  });

  const [value, setValue] = useState("");

  useEffect(() => {
    if (bioResult.status === "success" && !value) {
      setValue(bioResult.bio);
    }
  }, [bioResult, value]);

  const { writeContract } = useWriteContract();

  if (creatorInfoResult.status === "error") {
    return null;
  }

  if (
    accountResult.status === "reconnecting" ||
    creatorInfoResult.status === "pending" ||
    bioResult.status === "pending"
  ) {
    return null;
  }

  const handleSetBio = () => {
    setIsLoading(true);
    writeContract(
      {
        abi: EduStreamrAbi,
        address: creatorInfoResult.contractAddress,
        functionName: "setBio",
        args: [value],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });
          toast.success("Bio set");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set bio</CardTitle>
        <CardDescription>
          Set your bio to be displayed on the tip page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Textarea
            maxLength={130}
            placeholder="Enter your bio"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex justify-between">
            <Button
              disabled={isLoading}
              onClick={handleSetBio}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" />}
              <Pencil />
              <span>Set</span>
            </Button>
            <p className="text-xs text-gray-500">{value.length} / 130</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
