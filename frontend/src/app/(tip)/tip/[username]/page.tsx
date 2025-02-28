import { TipPage } from "./tip-page";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <TipPage username={username}/>
  );
}
