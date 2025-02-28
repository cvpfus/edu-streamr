"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { formatEther } from "viem";
import { readContract } from "@wagmi/core";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import { config } from "@/wagmi";
import { UniversalEduStreamrAbi } from "@/abi/UniversalEduStreamr";
import { useIsRegistered } from "@/hooks/use-is-registered";
import { useAccount } from "wagmi";
import { useGetCreatorInfoByAddress } from "@/hooks/edu-streamr";
import { UniversalEduStreamrAddress } from "@/constants";

export default function History() {
  const accountResult = useAccount();

  const creatorInfoResult = useGetCreatorInfoByAddress(accountResult.address);

  const isRegisteredResult = useIsRegistered(accountResult.address ?? "");

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

  const contractAddress =
    creatorInfoResult.status === "success"
      ? creatorInfoResult.contractAddress
      : UniversalEduStreamrAddress;
  const creatorAddress = accountResult.address;

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

  const isRegisteredCreator =
    isRegisteredResult.status === "success" ? isRegisteredResult.data : false;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Tip History</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip History</CardTitle>
          <CardDescription>
            View tip messages from your viewers.
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full h-[400px]">
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
        </CardContent>
      </Card>
    </div>
  );
}
