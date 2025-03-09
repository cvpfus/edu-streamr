"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { BaseError, useAccount, useWriteContract } from "wagmi";
import { useState } from "react";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, NotebookPen } from "lucide-react";
import Loading from "@/components/ui/loading";

export default function Register() {
  const account = useAccount();
  const isRegisteredResult = useIsRegistered(account.address);

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract } = useWriteContract();

  const queryClient = useQueryClient();

  if (isRegisteredResult.status === "success" && isRegisteredResult.data) {
    return null;
  }

  if (isRegisteredResult.status === "pending") return <Loading />;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    writeContract(
      {
        abi: UniversalEduStreamrAbi,
        address: UniversalEduStreamrAddress,
        functionName: "deployContract",
        args: [username],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, {
            hash: data,
          });

          setTimeout(async () => {
            await queryClient.invalidateQueries();
          }, 1000);

          toast.success("Registration successful");
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(
            (error as BaseError).details ||
              "Failed to register. See console for detailed error."
          );

          console.error(error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          <div>
            Register a username to make your URLs shorter. This action requires
            a small transaction fee (~0.0001 EDU).
          </div>
          <div>
            Username must be between 3 and 10 characters long. Username can only
            contain letters and numbers.
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <Input
            placeholder="Username"
            required
            minLength={3}
            maxLength={10}
            pattern="^[a-zA-Z0-9]+$"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Button
            type="submit"
            className="self-start flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <NotebookPen />}
            <span>Register</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
