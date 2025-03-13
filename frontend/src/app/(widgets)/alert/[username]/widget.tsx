"use client";

import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useGetCreatorInfoByUsername } from "@/hooks/use-get-creator-info-by-username";
import { useEffect, useState } from "react";
import { formatEther, isAddress, zeroAddress } from "viem";
import { useClient, useWatchContractEvent } from "wagmi";
import useSound from "use-sound";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { UniversalEduStreamrAddress } from "@/constants";
import { useGetColors } from "@/hooks/use-get-colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDuration } from "@/hooks/use-get-duration";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { getBlockNumber } from "@wagmi/core";
import { config } from "@/wagmi";

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
  const [isError, setIsError] = useState<boolean>(false);

  const isRegisteredResult = useIsRegistered(
    isAddress(username) ? username : undefined
  );

  const colorsResult = useGetColors({
    contractAddress:
      result.status === "success" ? result.contractAddress : undefined,
  });

  const durationResult = useGetDuration({
    contractAddress:
      result.status === "success" ? result.contractAddress : undefined,
  });

  useEffect(() => {
    const heartbeat = async () => {
      try {
        await getBlockNumber(config);
      } catch (error) {
        console.error(error);
      }
    };

    let intervalId = setInterval(heartbeat, 1 * 10 * 1000); // 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useWatchContractEvent({
    abi: UniversalEduStreamrAbi,
    address: UniversalEduStreamrAddress,
    eventName: "TipReceived",
    args: {
      recipientAddress: isAddress(username) ? username : zeroAddress,
    },
    onError: (error) => {
      setIsError(false);
      console.error(error);
    },
    onLogs: (logs) => {
      setIsError(false);

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
    address: result.status === "success" ? result.contractAddress : zeroAddress,
    eventName: "TipReceived",
    onError: (error) => {
      setIsError(true);
      console.error(error);
    },
    onLogs: (logs) => {
      setIsError(false);
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
          primary: "#ffffff",
          secondary: "#c1fc29",
          background: "#209bb9",
        };

  if (isError) {
    return (
      <div className="p-1">
        <Card className="w-full text-center bg-red-500 text-white">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            Connection lost. Please refresh the Browser Source.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (
    isRegisteredResult.status === "success" &&
    isRegisteredResult.data &&
    isAddress(username)
  ) {
    return (
      <div className="p-1">
        <Card className="w-full text-center bg-red-500 text-white">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            Please update your Browser Source URL to a new one. This usually
            happens when you register your username.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result.status === "error" && !isAddress(username)) {
    return (
      <div className="p-1">
        <Card className="w-full text-center bg-red-500 text-white">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            Error fetching username. Please double-check your Browser Source URL
            or refresh the Browser Source.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result.status === "pending") {
    return (
      <div className="p-1">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
          </CardHeader>
          <CardContent className="">Please wait</CardContent>
        </Card>
      </div>
    );
  }

  if (!currentMessage) return null;

  return (
    <div className="p-1">
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
    </div>
  );
}
