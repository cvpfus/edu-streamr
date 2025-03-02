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
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { TableData } from "./table-data";

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
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Tip History</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
          <CardDescription>
            View tip messages from your viewers.
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full h-[400px]">
          {isRegisteredResult.status === "success" &&
            (creatorInfoResult.status === "success" ||
              creatorInfoResult.status === "error") && (
              <TableData
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
