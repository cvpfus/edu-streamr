"use client";

import Image from "next/image";
import SideNavItems from "./side-nav-items";
import { useAccount, useReadContract } from "wagmi";
import { EduStreamrFactoryAbi } from "@/abi/EduStreamrFactory";
import { EduStreamrFactoryAddress } from "@/constants";

export default function SideNav() {
  const { isConnected, address } = useAccount();

  const result = useReadContract({
    abi: EduStreamrFactoryAbi,
    address: EduStreamrFactoryAddress,
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
    <div className="w-auto sm:w-64 border shadow-xl rounded-r-xl flex flex-col items-center gap-4 p-2 sticky top-0">
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
  );
}
