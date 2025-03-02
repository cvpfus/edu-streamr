"use client";

import Image from "next/image";
import SideNavItems from "./side-nav-items";
import { useAccount, useReadContract } from "wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";

export default function SideNav() {
  const { isConnected, address } = useAccount();

  const result = useReadContract({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    functionName: "creatorInfoByAddress",
    args: [address ?? "0x0"],
  });

  let username;

  if (isConnected && result.data && result.data[0]) {
    username = result.data[0];
  } else {
    username = "Guest";
  }

  return (
    <>
      <div className="shrink-0 max-w-[225px] w-16 sm:w-full" />
      <div className="w-16 max-w-[225px] sm:w-full border shadow-xl rounded-r-xl flex flex-col items-center gap-4 p-2 fixed h-screen">
        <Image
          src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`}
          alt="avatar"
          width={80}
          height={80}
          className="size-8 sm:size-20 rounded-full mt-4"
        />
        <div className="hidden sm:block">{username}</div>
        <SideNavItems />
      </div>
    </>
  );
}
