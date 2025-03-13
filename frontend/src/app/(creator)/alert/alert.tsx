"use client";

import { useAccount } from "wagmi";
import { useGetCreatorInfoByAddress } from "@/hooks/use-get-creator-info-by-address";
import { AlertUrl } from "./_components/alert-url";
import { Duration } from "./_components/duration";
import { useGetDuration } from "@/hooks/use-get-duration";
import { WidgetColors } from "./_components/widget-colors";
import { useGetColors } from "@/hooks/use-get-colors";
import { TestTip } from "./_components/test-tip";

export default function Alert({ baseUrl }: { baseUrl: string }) {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address!);

  const durationResult = useGetDuration({
    contractAddress:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
  });

  const colorsResult = useGetColors({
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
    <div className="flex flex-col gap-4 py-4">
      <div className="font-bold block sm:hidden">Alert</div>
      <div className="w-full flex flex-col md:flex-row gap-4">
        <AlertUrl fullUrl={fullUrl} username={username} />
        <TestTip />
      </div>
      {duration && (
        <Duration
          currentDuration={duration}
          contractAddress={contractAddress}
        />
      )}
      {creatorInfoResult.status === "success" &&
        colorsResult.status === "success" && (
          <WidgetColors
            contractAddress={creatorInfoResult.contractAddress}
            colors={colorsResult.colors}
          />
        )}
    </div>
  );
}
