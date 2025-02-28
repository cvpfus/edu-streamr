import { ConnectButton } from "@/components/ui/connect-button";
import SideNav from "./_components/side-nav";
import Connect from "./connect";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-auto">
      <SideNav />
      <div className="flex flex-col w-full mx-4">
        <div className="flex justify-end mt-4 ">
          <ConnectButton />
        </div>
        <div className="h-screen w-full mt-4 max-h-screen">
          <Connect>{children}</Connect>
        </div>
      </div>
    </div>
  );
}
