"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { useAccount } from "wagmi";
import { useGetCreatorInfoByAddress } from "@/hooks/use-get-creator-info-by-address";
import { UniversalEduStreamrAddress } from "@/constants";
import { HistoryTable } from "./history-table";

export default function History() {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const isRegisteredResult = useIsRegistered(accountResult.address ?? "");

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : UniversalEduStreamrAddress;

  const creatorAddress = accountResult.address;

  const isRegisteredCreator =
    isRegisteredResult.status === "success" ? isRegisteredResult.data : false;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="font-bold block sm:hidden">Tip History</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
          <CardDescription>
            View tip messages from your viewers.
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full">
          {isRegisteredResult.status === "success" &&
            (creatorInfoResult.status === "success" ||
              creatorInfoResult.status === "error") && (
              <HistoryTable
                contractAddress={contractAddress}
                creatorAddress={creatorAddress}
                isRegisteredCreator={isRegisteredCreator}
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
