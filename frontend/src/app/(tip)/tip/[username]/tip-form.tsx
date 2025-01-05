"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipFormData, formSchema } from "@/lib/definitions";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  BaseError,
} from "wagmi";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import { parseEther } from "viem";
import { useEffect } from "react";

export default function TipForm({
  creatorAddress,
  contractAddress,
}: {
  creatorAddress: `0x${string}`;
  contractAddress: `0x${string}`;
}) {
  const form = useForm<TipFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0.0001,
      message: "",
      anonymous: false,
    },
  });

  const { isConnected, address: senderAddress } = useAccount();

  const { writeContract, data: hash } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tip sent successfully.");
    }
  }, [isConfirmed]);

  const onSubmit = async (formData: TipFormData) => {
    try {
      if (!creatorAddress) {
        toast.error("Send tip failed. Recipient address not found.");
        return;
      }

      if (!contractAddress) {
        toast.error("Send tip failed. Contract address not found.");
        return;
      }

      if (!isConnected) {
        toast.error("Send tip failed. Please connect your wallet.");
        return;
      }

      if (creatorAddress.toLowerCase() === senderAddress?.toLowerCase()) {
        toast.error("Send tip failed. Cannot tip yourself.");
        return;
      }

      writeContract(
        {
          abi: EduStreamrAbi,
          address: contractAddress,
          functionName: "sendTip",
          args: [
            formData.anonymous ? "Anonymous" : formData.name,
            formData.message,
          ],
          value: parseEther(formData.amount.toString()),
        },
        {
          onError: (err) => {
            toast.error((err as BaseError).shortMessage || "Send tip failed.");
          },
        }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Send tip failed.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full"
      >
        <div className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name"
                    autoComplete="off"
                    {...field}
                    disabled={form.watch("anonymous")}
                    value={form.watch("anonymous") ? "Anonymous" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 mr-auto -mt-2">
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="anonymous"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="anonymous" className="font-normal">
                    Anonymous
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Amount"
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Message" maxLength={150} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-8">
          Send Tip
        </Button>
      </form>
    </Form>
  );
}
