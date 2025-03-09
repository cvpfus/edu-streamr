"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAccount, useReadContract } from "wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import SideNavItems from "./side-nav-items";

export const MobileSideNav = () => {
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
    username = address ? `${address.slice(0, 8)}...` : "Guest";
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="block sm:hidden">
        <Button>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="sr-only">Side Nav</SheetTitle>
        <div className="flex w-full flex-col items-center gap-4 h-full bg-background">
          <Image
            src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`}
            alt="avatar"
            width={80}
            height={80}
            className="size-20 rounded-full mt-4"
          />
          <div>{username}</div>
          <SideNavItems />
        </div>
      </SheetContent>
    </Sheet>
  );
};
