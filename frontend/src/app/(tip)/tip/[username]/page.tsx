import { Metadata } from "next";
import { TipPage } from "./_components/tip-page";
import { headers } from "next/headers";
import { isAddress } from "viem";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: isAddress(username) ? "EduStreamr" : `${username} | EduStreamr`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const head = await headers();
  const host = head.get("host");

  const { username } = await params;

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return <TipPage username={username} baseUrl={baseUrl} />;
}
