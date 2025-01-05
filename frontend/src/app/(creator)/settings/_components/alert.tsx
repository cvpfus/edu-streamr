"use client";

import { Input } from "@/components/ui/input";
import CopyButton from "@/components/ui/copy-button";
import { useAccount } from "wagmi";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";

export default function Alert({ baseUrl }: { baseUrl: string }) {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address!);

  const username =
    creatorInfoResult.status === "success" ? creatorInfoResult.username : "";

  const fullUrl = username ? `${baseUrl}/alert/${username}` : "";

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Input value={fullUrl} disabled={!username} readOnly />
      <div className="flex gap-2">
        <CopyButton text={fullUrl} disabled={!username} />
      </div>
    </div>
  );
}
