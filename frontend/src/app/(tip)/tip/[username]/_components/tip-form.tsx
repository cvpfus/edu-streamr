import { EduStreamrAbi } from "@/abi/EduStreamr";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UniversalEduStreamrAddress } from "@/constants";
import { TipFormData, formSchema } from "@/lib/definitions";
import { config } from "@/wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatEther, parseEther } from "viem";
import { BaseError, useAccount, useBalance, useWriteContract } from "wagmi";

export default function TipForm({
  creatorAddress,
  contractAddress,
  isToAddress,
}: {
  creatorAddress: string | undefined;
  contractAddress: string | undefined;
  isToAddress: boolean;
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

  const balanceResult = useBalance({
    address: senderAddress,
    query: { enabled: !!senderAddress },
  });

  const { writeContract } = useWriteContract();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: TipFormData) => {
    try {
      if (!creatorAddress) {
        toast.error("Send tip failed. Recipient address not found.");
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

      if (isToAddress) {
        setIsLoading(true);

        writeContract(
          {
            abi: UniversalEduStreamrAbi,
            address: UniversalEduStreamrAddress,
            functionName: "sendTip",
            args: [
              creatorAddress,
              formData.anonymous ? "Anonymous" : formData.name,
              formData.message,
            ],
            value: parseEther(formData.amount.toString()),
          },
          {
            onSuccess: async (data) => {
              await waitForTransactionReceipt(config, { hash: data });

              toast.success("Tip sent successfully.");

              setIsLoading(false);
            },
            onError: (error) => {
              toast.error(
                (error as BaseError).details ||
                  "Send tip failed. See console for detailed error."
              );

              console.error(error.message);

              setIsLoading(false);
            },
          }
        );

        return;
      }

      if (!contractAddress) {
        toast.error("Send tip failed. Contract address not found.");
        return;
      }

      setIsLoading(true);

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
          onSuccess: async (data) => {
            await waitForTransactionReceipt(config, { hash: data });

            toast.success("Tip sent successfully.");

            setIsLoading(false);
          },
          onError: (error) => {
            toast.error(
              (error as BaseError).details ||
                "Send tip failed. See console for detailed error."
            );

            console.error(error.message);

            setIsLoading(false);
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
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <FormControl>
                  <Input
                    id="name"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount" className="text-sm">
                    Amount (EDU)
                  </Label>
                  {balanceResult.isSuccess && (
                    <p className="text-xs text-gray-500">
                      Balance:{" "}
                      {Number(formatEther(balanceResult.data.value)).toFixed(5)}{" "}
                      EDU
                    </p>
                  )}
                </div>
                <FormControl>
                  <Input
                    id="amount"
                    placeholder="Amount"
                    type="number"
                    step="0.01"
                    min={form.formState.defaultValues?.amount}
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
                <Label htmlFor="message" className="text-sm">
                  Message
                </Label>
                <FormControl>
                  <Textarea
                    id="message"
                    placeholder="Message"
                    maxLength={250}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between items-center w-full">
                  <FormMessage />
                  <p className="text-xs text-gray-500 ml-auto">
                    {field.value.length} / 250
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-8 flex gap-2 items-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          <span>Send Tip</span>
        </Button>
      </form>
    </Form>
  );
}
