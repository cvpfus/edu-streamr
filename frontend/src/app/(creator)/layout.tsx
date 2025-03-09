import { ConnectButton } from "@/components/ui/connect-button";
import SideNav from "./_components/side-nav";
import Connect from "./connect";
import { MobileSideNav } from "./_components/mobile-side-nav";
import { RefreshButton } from "@/components/ui/refresh-button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <div className="flex flex-col w-full sm:max-w-[calc(100%-225px)] px-4 h-dvh max-h-dvh">
        <div className="flex gap-4 justify-between items-center mt-4 w-full">
          <MobileSideNav />
          <div className="w-full flex gap-4 justify-between items-center">
            <RefreshButton />
            <ConnectButton />
          </div>
        </div>
        <div className="h-full w-full mt-4">
          <Connect>{children}</Connect>
        </div>
      </div>
    </div>
  );
}
