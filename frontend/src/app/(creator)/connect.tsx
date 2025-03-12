"use client";

import { useAccount } from "wagmi";

export default function Connect({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { address } = useAccount();

  return (
    <>
      {!address && (
        <div className="flex h-full items-center justify-center text-center">
          <span>
            Please connect your wallet by clicking the button in the top right
            corner. You can sign in with Google or email, or use an external
            wallet if you prefer.
          </span>
        </div>
      )}
      {address && children}
    </>
  );
}
