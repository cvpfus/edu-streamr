import { Metadata } from "next";
import { headers } from "next/headers";
import Alert from "./alert";

export const metadata: Metadata = {
  title: "Alert"
}

export default async function AlertPage() {
  const head = await headers();
  const host = head.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  
  return <Alert baseUrl={baseUrl} />
}