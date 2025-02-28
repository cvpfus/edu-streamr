export interface ErrorReturnType {
  status: "error";
  errorMessage: string;
}

export interface PendingReturnType {
  status: "pending";
}