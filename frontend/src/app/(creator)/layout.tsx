import { ConnectButton } from "@/components/ui/connect-button";
import SideNav from "./_components/side-nav";
import Connect from "./connect";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <div className="flex flex-col w-full px-4 h-dvh max-h-dvh max-w-[calc(100dvw-64px)]">
        <div className="flex justify-end mt-4 ">
          <ConnectButton />
        </div>
        <div className="h-full w-full mt-4">
          <Connect>{children}</Connect>
        </div>
      </div>
    </div>
  );
}
