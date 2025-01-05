"use client";

import { useAccount } from "wagmi";

export default function Connect({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected && (
        <div className="flex h-full items-center justify-center">
          <span>Please connect your wallet.</span>
        </div>
      )}
      {isConnected && children}
    </>
  );
}
