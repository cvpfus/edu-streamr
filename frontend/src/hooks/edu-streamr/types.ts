type Tips = readonly {
  senderAddress: string;
  senderName: string;
  message: string;
  amount: bigint;
  timestamp: bigint;
}[];

interface BaseErrorReturnType {
  status: "error";
  errorMessage: string;
}

interface UseGetTipHistoryErrorReturnType extends BaseErrorReturnType {}

interface UseGetTipHistorySuccessReturnType {
  status: "success";
  paginatedTips: Tips;
  tipLength: bigint;
}

export type UseGetTipHistoryReturnType =
  | UseGetTipHistoryErrorReturnType
  | UseGetTipHistorySuccessReturnType;

interface UseGetCreatorInfoSuccessReturnType {
  status: "success";
  username: string;
  name: string;
  creatorAddress: string;
  contractAddress: string;
}

interface UseGetCreatorInfoErrorReturnType extends BaseErrorReturnType {}

interface UseGetCreatorInfoPendingReturnType {
  status: "pending";
}

export type UseGetCreatorInfoReturnType =
  | UseGetCreatorInfoErrorReturnType
  | UseGetCreatorInfoSuccessReturnType
  | UseGetCreatorInfoPendingReturnType;

interface UseGetStatsSuccessReturnType {
  status: "success";
  totalTipsReceived: bigint;
  tipCount: bigint;
}

interface UseGetStatsErrorReturnType extends BaseErrorReturnType {}

interface UseGetStatsPendingReturnType {
  status: "pending";
}

export type UseGetStatsReturnType =
  | UseGetStatsErrorReturnType
  | UseGetStatsSuccessReturnType
  | UseGetStatsPendingReturnType;
