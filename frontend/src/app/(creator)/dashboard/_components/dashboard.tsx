"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import History from "./history";
import {
  useAccount,
  useBalance,
  useWriteContract,
} from "wagmi";
import CopyButton from "@/components/ui/copy-button";
import {
  useGetCreatorInfoByAddress,
  useGetCreatorStats,
} from "@/hooks/edu-streamr";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { config } from "@/wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

export default function Dashboard({ baseUrl }: { baseUrl: string }) {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address!);

  const { writeContract } = useWriteContract();

  const statsResult = useGetCreatorStats(
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined
  );

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const balanceResult = useBalance({
    address:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
    query: { enabled: creatorInfoResult.status === "success" },
  });

  if (creatorInfoResult.status === "error") {
    router.push("/register");
    return null;
  }

  if (
    accountResult.status === "reconnecting" ||
    creatorInfoResult.status === "pending"
  ) {
    return null;
  }

  const username = creatorInfoResult.username;

  const fullUrl = `${baseUrl}/tip/${username}`;

  const handleWithdraw = () => {
    setIsLoading(true);

    writeContract(
      {
        abi: EduStreamrAbi,
        address: creatorInfoResult.contractAddress,
        functionName: "withdraw",
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });
          setIsLoading(false);

          await balanceResult.refetch();

          toast.success("Withdraw successful.");
        },
        onError: (error) => {
          toast.error(error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Dashboard</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip URL</CardTitle>
          <CardDescription>Use this URL to receive tips.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Input readOnly value={username && fullUrl} />
          <CopyButton text={fullUrl} disabled={!username} />
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tips Received</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              {balanceResult.status === "success" &&
                `${formatEther(balanceResult.data.value)} ${balanceResult.data.symbol}`}
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleWithdraw}
              disabled={
                balanceResult.status === "pending" ||
                balanceResult.status === "error" ||
                balanceResult.data.value === BigInt(0) ||
                isLoading
              }
            >
              {isLoading && <Loader2 className="size-2 animate-spin" />}
              <ArrowUpFromLine />
              <span>Withdraw</span>
            </Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Tips Received</CardTitle>
          </CardHeader>
          <CardContent>
            {statsResult.status === "success" &&
              `${formatEther(statsResult.totalTipsReceived)} ${balanceResult.data?.symbol}`}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Tippers</CardTitle>
          </CardHeader>
          <CardContent>
            {statsResult.status === "success" && statsResult.totalTippers}
          </CardContent>
        </Card>
      </div>
      {creatorInfoResult.status === "success" && (
        <History contractAddress={creatorInfoResult.contractAddress} />
      )}
    </div>
  );
}
