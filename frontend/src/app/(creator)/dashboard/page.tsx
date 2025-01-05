import { Metadata } from "next";
import { headers } from "next/headers";
import Dashboard from "./_components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const head = await headers();
  const host = head.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return <Dashboard baseUrl={baseUrl} />;
}
