"use client";

import { EduStreamrAbi } from "@/abi/EduStreamr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetCreatorInfoByAddress,
  useGetCreatorStats,
} from "@/hooks/edu-streamr";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useRouter } from "next/navigation";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import toast from "react-hot-toast";
import { Loader2, Pencil } from "lucide-react";

export default function Bio() {
  const [isLoading, setIsLoading] = useState(false);

  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address!);

  const statsResult = useGetCreatorStats(
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined
  );

  const [value, setValue] = useState("");

  useEffect(() => {
    if (statsResult.status === "success" && !value) {
      setValue(statsResult.bio);
    }
  }, [statsResult, value]);

  const { writeContract } = useWriteContract();

  const router = useRouter();

  if (creatorInfoResult.status === "error") {
    router.push("/register");
    return null;
  }

  if (
    accountResult.status === "reconnecting" ||
    creatorInfoResult.status === "pending" ||
    statsResult.status === "pending"
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
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        maxLength={130}
        placeholder="Enter your bio"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-between">
        <p className="text-xs text-gray-500">{value.length} / 130</p>
        <Button
          disabled={isLoading}
          onClick={handleSetBio}
          className="flex items-center gap-2"
        >
          {isLoading && <Loader2 className="animate-spin" />}
          <Pencil />
          <span>Set</span>
        </Button>
      </div>
    </div>
  );
}
