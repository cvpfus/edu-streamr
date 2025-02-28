import { Metadata } from "next";
import { headers } from "next/headers";
import { Settings } from "./settings";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  return <Settings />;
}
