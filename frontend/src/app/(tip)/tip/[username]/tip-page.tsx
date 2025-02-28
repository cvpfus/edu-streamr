"use client"

import { useGetCreatorInfoByUsername } from "@/hooks/edu-streamr";
import TipForm from "./tip-form";
import Image from "next/image";
import { isAddress } from "viem";
import { useGetBio } from "@/hooks/use-get-bio";

export const TipPage = ({ username }: { username: string }) => {
  const creatorInfoByUsernameResult = useGetCreatorInfoByUsername(username);

  const usernameOrAddress =
    creatorInfoByUsernameResult.status === "success"
      ? creatorInfoByUsernameResult.username
      : isAddress(username)
      ? username
      : undefined;

  const creatorInfo =
    creatorInfoByUsernameResult.status === "success"
      ? {
          contractAddress: creatorInfoByUsernameResult.contractAddress,
          creatorAddress: creatorInfoByUsernameResult.creatorAddress,
        }
      : undefined;

  const bioResult = useGetBio({
    contractAddress: creatorInfo?.contractAddress,
  });

  const bio = bioResult.status === "success" ? bioResult.bio : "";

  if (!usernameOrAddress) {
    return <div>Creator not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 gap-2 max-w-md mx-4 shadow-md border min-w-[450px]">
      <Image
        src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`}
        alt={username}
        width={64}
        height={64}
        className="size-16 rounded-full"
      />
      <div className="text-center">Tip to {username}</div>
      <div className="text-sm text-gray-500 mb-1">{bio}</div>
      <TipForm
        creatorAddress={isAddress(username) ? username : creatorInfo?.creatorAddress}
        contractAddress={creatorInfo?.contractAddress}
        isToAddress={isAddress(username)}
      />
    </div>
  );
};
