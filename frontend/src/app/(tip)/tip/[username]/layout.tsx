import { ConnectButton } from "@/components/ui/connect-button";
import { RequestButton } from "./_components/request-button";
import { headers } from "next/headers";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const head = await headers();
  const host = head.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="flex flex-col w-full h-dvh items-center relative">
      <div className="ml-auto m-4 flex items-center gap-4">
        <RequestButton baseUrl={baseUrl} />
        <ConnectButton />
      </div>
      <div className="flex items-center justify-center h-full w-full px-4">
        {children}
      </div>
    </div>
  );
}
