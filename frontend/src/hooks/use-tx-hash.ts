import { useRef, useState } from "react";

export const useTxHash = () => {
  const [txHash, setTxHash] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTxHashWithTimeout = (data: string, delayMs: number = 10000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setTxHash(data);

    timeoutRef.current = setTimeout(() => {
      setTxHash("");
    }, delayMs);
  };

  return { txHash, setTxHashWithTimeout };
};
