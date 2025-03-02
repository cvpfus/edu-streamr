import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { useState } from "react";
import { formatEther } from "viem";
import { readContract } from "@wagmi/core";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import { config } from "@/wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";

interface TableDataProps {
  isRegisteredCreator: boolean;
  contractAddress: string;
  creatorAddress?: string;
}

export const TableData = ({
  isRegisteredCreator,
  contractAddress,
  creatorAddress,
}: TableDataProps) => {
  const [colDefs, _] = useState<ColDef[]>([
    {
      field: "timestamp",
      headerName: "Date & Time",
      valueGetter: (params) => {
        if (!params.data) return;
        return new Date(Number(params.data.timestamp) * 1000).toLocaleString();
      },
    },
    { field: "senderName", headerName: "Sender" },
    {
      field: "amount",
      headerName: "Amount",
      valueGetter: (params) => {
        if (!params.data) return;
        return formatEther(params.data.amount);
      },
    },
    { field: "message", headerName: "Message" },
  ]);

  const onGridReady = async (params: GridReadyEvent) => {
    const datasource: IDatasource = {
      getRows: async (params: IGetRowsParams) => {
        const { startRow, endRow } = params;

        try {
          const [tips, tipsLength] = isRegisteredCreator
            ? await readContract(config, {
                abi: EduStreamrAbi,
                address: contractAddress,
                functionName: "getTipHistory",
                args: [BigInt(startRow), BigInt(endRow)],
              })
            : await readContract(config, {
                abi: UniversalEduStreamrAbi,
                address: contractAddress,
                functionName: "getTipHistory",
                args: [
                  creatorAddress ?? "0x0",
                  BigInt(startRow),
                  BigInt(endRow),
                ],
              });

          params.successCallback([...tips], Number(tipsLength));
        } catch (error) {
          console.error("Error fetching data from contract:", error);
          params.failCallback();
        }
      },
      rowCount: undefined,
    };

    params.api.setGridOption("datasource", datasource);
  };

  return (
    <AgGridReact
      rowModelType="infinite"
      cacheBlockSize={10}
      maxBlocksInCache={10}
      columnDefs={colDefs}
      onGridReady={onGridReady}
      defaultColDef={{ flex: 1 }}
      rowHeight={60}
      pagination={true}
      paginationPageSize={10}
      paginationPageSizeSelector={[10, 25, 50]}
    />
  );
};
