type Tips = readonly {
  senderAddress: `0x${string}`;
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

interface UseGetTipHistory2ErrorReturnType extends BaseErrorReturnType {}

interface UseGetTipHistory2SuccessReturnType {
  status: "success";
  paginatedTips: Tips;
  tipLength: bigint;
}

export type UseGetTipHistory2ReturnType =
  | UseGetTipHistory2ErrorReturnType
  | UseGetTipHistory2SuccessReturnType;

interface UseGetAllTipsErrorReturnType extends BaseErrorReturnType {}

interface UseGetAllTipsSuccessReturnType {
  status: "success";
  tips: Tips;
}

export type UseGetAllTipsReturnType =
  | UseGetAllTipsErrorReturnType
  | UseGetAllTipsSuccessReturnType;

interface UseGetCreatorInfoSuccessReturnType {
  status: "success";
  username: string;
  creatorAddress: `0x${string}`;
  contractAddress: `0x${string}`;
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
  totalTippers: bigint;
  bio: string;
}

interface UseGetStatsErrorReturnType extends BaseErrorReturnType {}

interface UseGetStatsPendingReturnType {
  status: "pending";
}

export type UseGetStatsReturnType =
  | UseGetStatsErrorReturnType
  | UseGetStatsSuccessReturnType
  | UseGetStatsPendingReturnType;
