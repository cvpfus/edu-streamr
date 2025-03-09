import { useGetUniversalTipHistory } from "@/hooks/use-get-universal-tip-history";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGetTipHistory } from "@/hooks/use-get-tip-history";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { getBlockNumber } from "@wagmi/core";
import { config } from "@/wagmi";

interface HistoryTableProps {
  isRegisteredCreator: boolean;
  contractAddress: string;
  creatorAddress?: string;
}

export const HistoryTable = ({
  isRegisteredCreator,
  contractAddress,
  creatorAddress,
}: HistoryTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tipHistory = useGetTipHistory({
    contractAddress,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const universalTipHistory = useGetUniversalTipHistory({
    creatorAddress,
    contractAddress,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
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
  const tipHistoryResult = isRegisteredCreator
    ? tipHistory
    : universalTipHistory;

  const data =
    tipHistoryResult.status === "success" ? tipHistoryResult.paginatedTips : [];

  const rowCount =
    tipHistoryResult.status === "success"
      ? tipHistoryResult.tipLength
      : undefined;

  return (
    <>
      {data && (
        <DataTable
          columns={columns}
          data={[...data]}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={Number(rowCount ?? 1)}
        />
      )}
    </>
  );
};
