"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";
import { ActionCell } from "./_components/action-cell";

export interface History {
  timestamp: string;
  amount: string;
  senderName: string;
  message: string;
}

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: "timestamp",
    header: "Tipped At",
  },
  {
    accessorKey: "senderName",
    header: "Sender Name",
  },
  {
    accessorKey: "amount",
    header: "Amount (EDU)",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return ActionCell({ row });
    },
  },
];
