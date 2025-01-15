"use client";

import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useGetCreatorInfoByUsername } from "@/hooks/edu-streamr";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useWatchContractEvent } from "wagmi";
import useSound from "use-sound";

interface Message {
  senderAddress?: `0x${string}`;
  senderName?: string;
  message?: string;
  amount?: bigint;
}

export default function Widget({ username }: { username: string }) {
  const result = useGetCreatorInfoByUsername(username);

  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  useWatchContractEvent({
    abi: EduStreamrAbi,
    address: result.status === "success" ? result.contractAddress : "0x0",
    eventName: "TipReceived",
    onError: (error) => {
      console.error(error);
    },
    onLogs: (logs) => {
      const { senderAddress, senderName, message, amount } = logs[0].args;

      setMessageQueue((prevQueue) => [
        ...prevQueue,
        { senderAddress, senderName, message, amount },
      ]);
    },
    enabled: result.status === "success",
  });

  const [play] = useSound("/kaching.mp3");

  useEffect(() => {
    if (currentMessage === null && messageQueue.length > 0) {
      setCurrentMessage(messageQueue[0]);

      play({ forceSoundEnabled: true });

      setTimeout(() => {
        setCurrentMessage(null);
        setMessageQueue((prevQueue) => prevQueue.slice(1));
      }, 5000);
    }
  }, [currentMessage, messageQueue]);

  if (result.status === "error") {
    return <div>Error fetching username. Please refresh.</div>;
  }

  if (result.status === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      {currentMessage && (
        <div className="text-center bg-black/80 p-8 rounded-lg shadow-xl animate-fade-in w-full">
          <div className="text-3xl font-bold text-white mb-4 animate-slide-down">
            {currentMessage.senderName}
          </div>
          <div className="text-xl text-gray-200 mb-4 animate-slide-up animate-fade-in">
            {currentMessage.message}
          </div>
          <div className="text-2xl font-semibold text-green-400 animate-pulse">
            {currentMessage.amount ? formatEther(currentMessage.amount) : "0"}{" "}
            EDU
          </div>
        </div>
      )}
    </div>
  );
}
