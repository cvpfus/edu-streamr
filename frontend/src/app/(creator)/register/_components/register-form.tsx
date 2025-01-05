"use client";

import { EduStreamrFactoryAbi } from "@/abi/EduStreamrFactory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EduStreamrFactoryAddress } from "@/constants";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
  const { isConnected, address } = useAccount();

  const { writeContract } = useWriteContract();

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const result = useReadContract({
    abi: EduStreamrFactoryAbi,
    address: EduStreamrFactoryAddress,
    functionName: "creatorInfoByAddress",
    args: [address ?? "0x0"],
  });

  if (isConnected && address && result.data && result.data[0]) {
    router.push("/dashboard");
  }

  const handleRegister = async () => {
    setIsLoading(true);

    writeContract(
      {
        abi: EduStreamrFactoryAbi,
        address: EduStreamrFactoryAddress,
        functionName: "deployContract",
        args: [username],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });

          setIsLoading(false);

          toast.success("Registration successful!");
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.error(error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Input
        placeholder="Username"
        required
        min={3}
        max={10}
        autoComplete="off"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <Button
        onClick={handleRegister}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        <span>Register</span>
      </Button>
    </div>
  );
}
