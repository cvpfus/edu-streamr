"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "./button";
import { useQueryClient } from "@tanstack/react-query";

export const RefreshButton = () => {
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  return (
    <Button className="mr-auto" onClick={handleRefresh}>
      <RefreshCw />
      <span className="hidden sm:inline">Refresh</span>
    </Button>
  );
};
