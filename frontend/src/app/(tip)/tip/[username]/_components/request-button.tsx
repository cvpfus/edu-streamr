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

    const result = await requestEdu({
      baseUrl,
      address: accountResult.address,
    });

    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("EDU requested successfully");

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (
    !accountResult.address ||
    (hasClaimedResult.status === "success" && hasClaimedResult.hasClaimed)
  ) {
    return null;
  }

  if (hasClaimedResult.status === "pending") {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
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
      <span>Request 0.01 EDU</span>
    </Button>
  );
};
