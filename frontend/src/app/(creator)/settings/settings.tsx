"use client";

import Register from "./_components/register";
import Bio from "./_components/bio";
import { useAccount } from "wagmi";
import Loading from "@/components/ui/loading";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import Username from "./_components/username";
import Name from "./_components/name";

export const Settings = () => {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  if (accountResult.status == "reconnecting") {
    return <Loading />;
  }

  const username =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.username
      : undefined;

  const name =
    creatorInfoResult.status === "success" ? creatorInfoResult.name : undefined;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Settings</div>
      <Register />
      {username && <Username currentUsername={username} />}
      {name && <Name currentName={name} />}
      <Bio creatorInfoResult={creatorInfoResult} />
    </div>
  );
};
