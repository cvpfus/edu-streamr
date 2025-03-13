"use client";

import Loading from "@/components/ui/loading";
import { useGetCreatorInfoByAddress } from "@/hooks/use-get-creator-info-by-address";
import { useGetBio } from "@/hooks/use-get-bio";
import { useAccount } from "wagmi";
import Bio from "./_components/bio";
import Name from "./_components/name";
import Register from "./_components/register";
import Username from "./_components/username";

export const Settings = () => {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const bioResult = useGetBio({
    contractAddress:
      creatorInfoResult.status === "success"
        ? creatorInfoResult.contractAddress
        : undefined,
  });

  if (!accountResult.isConnected) {
    return <Loading />;
  }

  const username =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.username
      : undefined;

  const name =
    creatorInfoResult.status === "success" ? creatorInfoResult.name : undefined;

  const bio = bioResult.status === "success" ? bioResult.bio : "";

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : undefined;

  return (
    <div className="w-full h-full flex flex-col gap-4 py-4">
      <div className="font-bold block sm:hidden">Settings</div>
      <Register />
      {username && <Username currentUsername={username} />}
      {name && <Name currentName={name} />}

      {bioResult.status === "success" && (
        <Bio bio={bio} contractAddress={contractAddress} />
      )}
    </div>
  );
};
