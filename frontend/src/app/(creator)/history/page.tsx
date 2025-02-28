import { Metadata } from "next";
import History from "./history";

export const metadata: Metadata = {
  title: "Tip History",
};

export default function HistoryPage() {
  return (
    <History/>
  );
}
