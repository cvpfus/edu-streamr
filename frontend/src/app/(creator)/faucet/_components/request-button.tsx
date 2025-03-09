"use client";

import { Button } from "@/components/ui/button";
import { requestEdu } from "@/lib/actions";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Droplets, Loader2 } from "lucide-react";
import { useHasClaimed } from "@/hooks/use-has-claimed";

export const RequestButton = ({ baseUrl }: { baseUrl: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const accountResult = useAccount();

  const hasClaimedResult = useHasClaimed(accountResult.address);

  const handleRequest = async () => {
    setIsLoading(true);

    if (!accountResult.address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      await requestEdu({ baseUrl, address: accountResult.address });

      toast.success("EDU requested successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || "An error occurred while requesting EDU"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (hasClaimedResult.status === "pending") {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
      </Button>
    );
  }

  if (hasClaimedResult.status === "success" && hasClaimedResult.hasClaimed) {
    return (
      <Button disabled>
        <Droplets />
        <span>Already Claimed</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRequest}
      disabled={isLoading}
      className="flex gap-2 items-center"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Droplets />}
      <span>Request</span>
    </Button>
  );
};
