"use client";

import {
  useGetCreatorInfoByAddress,
  useGetCreatorInfoByUsername,
} from "@/hooks/edu-streamr";
import TipForm from "./tip-form";
import Image from "next/image";
import { isAddress } from "viem";
import { useGetBio } from "@/hooks/use-get-bio";
import Loading from "@/components/ui/loading";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export const TipPage = ({
  username,
  baseUrl,
}: {
  username: string;
  baseUrl: string;
}) => {
  const router = useRouter();

  const creatorInfoByAddressResult = useGetCreatorInfoByAddress(
    isAddress(username) ? username : undefined
  );

  const creatorInfoByUsernameResult = useGetCreatorInfoByUsername(username);

  const { address } = useAccount();

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
          username: creatorInfoByUsernameResult.username,
          name: creatorInfoByUsernameResult.name,
        }
      : undefined;

  const bioResult = useGetBio({
    contractAddress: creatorInfo?.contractAddress,
  });

  const bio = bioResult.status === "success" ? bioResult.bio : "";

  if (
    creatorInfoByUsernameResult.status === "pending" ||
    creatorInfoByAddressResult.status === "pending"
  ) {
    return <Loading />;
  }

  if (!usernameOrAddress) {
    return <div>Creator not found</div>;
  }

  if (!address) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <span>
          Please connect your wallet by clicking the button in the top right
          corner. You can sign in with Google or email, or use an external
          wallet if you prefer.
        </span>
      </div>
    );
  }

  if (creatorInfoByAddressResult.status === "success") {
    const username = creatorInfoByAddressResult.username;

    router.push(`${baseUrl}/tip/${username}`);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 gap-2 max-w-md w-full border-2 border-r-4 border-b-4 border-black">
      <Image
        src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`}
        alt={username}
        width={64}
        height={64}
        className="size-16 rounded-full"
      />
      <div>
        <div className="text-center">{creatorInfo?.name}</div>
        <div className="text-center text-sm text-gray-500 break-all">
          @{username}
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-1">{bio}</div>
      <TipForm
        creatorAddress={
          isAddress(username) ? username : creatorInfo?.creatorAddress
        }
        contractAddress={creatorInfo?.contractAddress}
        isToAddress={isAddress(username)}
      />
    </div>
  );
};
