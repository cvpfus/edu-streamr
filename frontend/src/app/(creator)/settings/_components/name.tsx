"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

export default function Name({ currentName }: { currentName?: string }) {
  console.log("Name 2", currentName);

  const [name, setName] = useState(currentName ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract } = useWriteContract();

  const queryClient = useQueryClient();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    writeContract(
      {
        abi: UniversalEduStreamrAbi,
        address: UniversalEduStreamrAddress,
        functionName: "changeName",
        args: [name],
      },
      {
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, { hash: data });

          setIsLoading(false);

          await queryClient.invalidateQueries();

          toast.success("Name updated");
        },
        onError: (error) => {
          toast.error(error.message);
          setIsLoading(false);
        },
      }
    );
  };

  if (!currentName) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update name</CardTitle>
        <CardDescription>
          <div>
            Update your current name. This action requires a small transaction
            fee (~0.0001 EDU).
          </div>
          <div>
            Name must be between 3 and 35 characters long. Name can only contain
            letters and spaces.
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <Input
            placeholder="Name"
            required
            minLength={3}
            maxLength={35}
            pattern="^[a-zA-Z ]+$"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button
            type="submit"
            className="self-start flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            <span>Save</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
