"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import CopyButton from "@/components/ui/copy-button";
import {
  useGetCreatorInfoByAddress,
  useGetCreatorStats,
} from "@/hooks/edu-streamr";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import toast from "react-hot-toast";
import { useState } from "react";
import { ArrowUpFromLine, Loader2, RefreshCw } from "lucide-react";
import { config } from "@/wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import Loading from "@/components/ui/loading";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { cn } from "@/lib/utils";
import { useGetUnregisteredCreatorStats } from "@/hooks/use-get-unregistered-creator-stats";
import { useTxHash } from "@/hooks/use-tx-hash";
import Link from "next/link";
import { EXPLORER_TX_BASE_URL } from "@/constants";
import { BaseError } from "wagmi";

export default function Dashboard({ baseUrl }: { baseUrl: string }) {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const { writeContract } = useWriteContract();

  const { txHash, setTxHashWithTimeout } = useTxHash();

  const isRegisteredResult = useIsRegistered(accountResult.address ?? "");

  const statsResult = useGetCreatorStats(
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined
  );

  const unregisteredCreatorStatsResult = useGetUnregisteredCreatorStats(
    accountResult.address
  );

  const [isLoading, setIsLoading] = useState(false);

  const contractBalanceResult = useBalance({
    address:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
    query: { enabled: creatorInfoResult.status === "success" },
  });

  if (
    creatorInfoResult.status === "pending" ||
    isRegisteredResult.status === "pending" ||
    unregisteredCreatorStatsResult.status === "pending" ||
    !accountResult.isConnected
  ) {
    return <Loading />;
  }

  const username =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.username
      : accountResult.address;

  const fullUrl = `${baseUrl}/tip/${username}`;

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined;

  const handleWithdraw = () => {
    setIsLoading(true);

    if (!contractAddress) {
      toast.error("Contract address not found.");
      setIsLoading(false);
      return;
    }

    writeContract(
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "withdraw",
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });

          setTxHashWithTimeout(data);

          await contractBalanceResult.refetch();

          toast.success("Withdraw successful.");

          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(
            (error as BaseError).details ||
              "Failed to withdraw. See console for detailed error."
          );

          console.error(error.message);

          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="font-bold block sm:hidden">Dashboard</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip URL</CardTitle>
          <CardDescription>
            <div>
              Use this URL to receive tips. You can put it in your live stream's
              description or pin it in your live chat.
            </div>
            {creatorInfoResult.status === "error" && (
              <div>
                To shorten the URL, go to Settings and register your username
                (you can register later when you have received a tip or when you
                have enough funds to pay the gas fee).
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <Input readOnly value={fullUrl} />
          <CopyButton text={fullUrl} disabled={!username} />
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pending Tips</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center gap-4">
            <div>
              {contractBalanceResult.status === "success" &&
                `${formatEther(contractBalanceResult.data.value)} ${
                  contractBalanceResult.data.symbol
                }`}
              {isRegisteredResult.isSuccess && !isRegisteredResult.data && (
                <span className="text-sm italic">
                  For accounts that do not have a username, tips are sent
                  directly to the wallet address.
                </span>
              )}
            </div>
            <Button
              className={cn(
                "flex items-center gap-2",
                isRegisteredResult.isSuccess && !isRegisteredResult.data
                  ? "hidden"
                  : ""
              )}
              onClick={handleWithdraw}
              disabled={
                contractBalanceResult.status === "pending" ||
                contractBalanceResult.status === "error" ||
                contractBalanceResult.data.value === BigInt(0) ||
                isLoading
              }
            >
              {isLoading ? (
                <Loader2 className="size-2 animate-spin" />
              ) : (
                <ArrowUpFromLine />
              )}

              <span>Withdraw</span>
            </Button>
          </CardContent>
          {txHash ? (
            <CardFooter>
              <Link
                href={`${EXPLORER_TX_BASE_URL}/${txHash}`}
                className="underline text-xs"
                target="blank"
              >
                Success! Click here to view the transaction.
              </Link>
            </CardFooter>
          ) : (
            ""
          )}
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Tips Received</CardTitle>
          </CardHeader>
          <CardContent>
            {statsResult.status === "success" &&
              `${formatEther(statsResult.totalTipsReceived)} EDU`}
            {unregisteredCreatorStatsResult.status === "success" &&
              isRegisteredResult.status === "success" &&
              !isRegisteredResult.data &&
              `${formatEther(
                unregisteredCreatorStatsResult.totalTipsReceived
              )} EDU`}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tip Count</CardTitle>
          </CardHeader>
          <CardContent>
            {statsResult.status === "success" && statsResult.tipCount}
            {unregisteredCreatorStatsResult.status === "success" &&
              isRegisteredResult.status === "success" &&
              !isRegisteredResult.data &&
              unregisteredCreatorStatsResult.tipCount}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
