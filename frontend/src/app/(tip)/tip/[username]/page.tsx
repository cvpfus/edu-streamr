import { readContract } from "@wagmi/core";
import TipForm from "./tip-form";
import Image from "next/image";
import { EduStreamrFactoryAddress } from "@/constants";
import { EduStreamrFactoryAbi } from "@/abi/EduStreamrFactory";
import { config } from "@/wagmi";
import { EduStreamrAbi } from "@/abi/EduStreamr";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const result = await readContract(config, {
    abi: EduStreamrFactoryAbi,
    address: EduStreamrFactoryAddress,
    functionName: "creatorInfoByUsername",
    args: [username],
  });

  if (result[0] === "") {
    return <div>Creator not found</div>;
  }

  const bioResult = await readContract(config, {
    abi: EduStreamrAbi,
    address: result[2],
    functionName: "bio",
  });

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 gap-2 max-w-md mx-4 shadow-md border min-w-[450px]">
      <Image
        src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`}
        alt={username}
        width={64}
        height={64}
        className="size-16 rounded-full"
      />
      <div>Tip to {username}</div>
      <div className="text-sm text-gray-500 mb-1">{bioResult}</div>
      <TipForm creatorAddress={result[1]} contractAddress={result[2]} />
    </div>
  );
}
