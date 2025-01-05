import ConnectButton from "@/components/ui/connect-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      {children}
    </div>
  );
}
