"use client";

import { useAccount } from "wagmi";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import { AlertUrl } from "./_components/alert-url";
import { Duration } from "./_components/duration";
import { useGetDuration } from "@/hooks/use-get-duration";
import { WidgetColors } from "./_components/widget-colors";

export default function Alert({ baseUrl }: { baseUrl: string }) {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address!);

  const durationResult = useGetDuration({
    contractAddress:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
  });

  const username =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.username
      : accountResult.address;

  const fullUrl = `${baseUrl}/alert/${username}`;

  const duration =
    durationResult.status === "success"
      ? durationResult.duration
      : durationResult.status === "error"
      ? 5
      : undefined;

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Alert</div>
      <AlertUrl fullUrl={fullUrl} username={username} />
      {duration && (
        <Duration
          currentDuration={duration}
          contractAddress={contractAddress}
        />
      )}
      <WidgetColors />
    </div>
  );
}
