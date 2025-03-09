"use client";

import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useGetCreatorInfoByUsername } from "@/hooks/edu-streamr";
import { useEffect, useState } from "react";
import { formatEther, isAddress } from "viem";
import { useWatchContractEvent } from "wagmi";
import useSound from "use-sound";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { useGetColors } from "@/hooks/use-get-colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDuration } from "@/hooks/use-get-duration";

interface Message {
  senderAddress: string;
  senderName: string;
  message: string;
  amount: bigint;
}

export default function Widget({ username }: { username: string }) {
  const result = useGetCreatorInfoByUsername(username);

  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  const colorsResult = useGetColors({
    contractAddress:
      result.status === "success" ? result.contractAddress : undefined,
  });

  const durationResult = useGetDuration({
    contractAddress:
      result.status === "success" ? result.contractAddress : undefined,
  });

  useWatchContractEvent({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    eventName: "TipReceived",
    args: {
      recipientAddress: isAddress(username) ? username : "0x0",
    },
    onError: (error) => {
      console.error(error);
    },
    onLogs: (logs) => {
      const { senderAddress, senderName, message, amount } = logs[0].args;

      if (senderAddress && senderName && message && amount)
        setMessageQueue((prevQueue) => [
          ...prevQueue,
          { senderAddress, senderName, message, amount },
        ]);
    },
    enabled: isAddress(username),
  });

  useWatchContractEvent({
    abi: EduStreamrAbi,
    address: result.status === "success" ? result.contractAddress : "0x0",
    eventName: "TipReceived",
    onError: (error) => {
      console.error(error);
    },
    onLogs: (logs) => {
      const { senderAddress, senderName, message, amount } = logs[0].args;

      if (senderAddress && senderName && message && amount)
        setMessageQueue((prevQueue) => [
          ...prevQueue,
          { senderAddress, senderName, message, amount },
        ]);
    },
    enabled: result.status === "success",
  });

  const [play] = useSound("/alert.mp3");

  const duration =
    durationResult.status === "success" ? durationResult.duration : 5;

  useEffect(() => {
    if (currentMessage === null && messageQueue.length > 0) {
      setCurrentMessage(messageQueue[0]);

      play({ forceSoundEnabled: true });

      setTimeout(() => {
        setCurrentMessage(null);
        setMessageQueue((prevQueue) => prevQueue.slice(1));
      }, duration * 1000);
    }
  }, [currentMessage, messageQueue]);

  const colors =
    colorsResult.status === "success"
      ? colorsResult.colors
      : {
          primary: "#000000",
          secondary: "#000000",
          background: "#ffffff",
        };

  if (result.status === "error" && !isAddress(username)) {
    return (
      <Card className="w-full text-center bg-destructive text-white">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          Error fetching username. Please refresh your OBS Browser Source.
        </CardContent>
      </Card>
    );
  }

  if (result.status === "pending") {
    return (
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
        </CardHeader>
        <CardContent className="">Please wait</CardContent>
      </Card>
    );
  }

  if (!currentMessage) return null;

  return (
    <Card
      className="w-full text-center"
      style={{ backgroundColor: colors.background }}
    >
      <CardHeader>
        <CardTitle className="font-normal">
          <span className="font-medium" style={{ color: colors.secondary }}>
            {currentMessage.senderName}{" "}
          </span>
          <span style={{ color: colors.primary }}>tipped </span>
          <span className="font-medium" style={{ color: colors.secondary }}>
            {formatEther(currentMessage.amount)} EDU
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent style={{ color: colors.primary }}>
        {currentMessage.message}
      </CardContent>
    </Card>
  );
}
