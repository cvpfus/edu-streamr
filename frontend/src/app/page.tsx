import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BadgePercent, Video, Zap } from "lucide-react";
import GitHubIcon from "@/components/icon/GithubIcon";
import XIcon from "@/components/icon/XIcon";

const opportunities = [
  {
    title: "Seamless Integration for Streamers",
    description:
      "Streamers can easily integrate EduStreamr into their existing setup. The platform is designed to be simple for streamers.",
    icon: <Video className="text-cyan-600 size-6" />,
  },
  {
    title: "Low Platform Fees",
    description:
      "Streamers retain 98% of their earnings. EduStreamr is designed to be a low-fee tipping platform for streamers.",
    icon: <BadgePercent className="text-cyan-600 size-6" />,
  },
  {
    title: "Instant Payouts",
    description:
      "No delayed payouts. Streamers can withdraw their earnings instantly, no more delays of days or even weeks.",
    icon: <Zap className="text-cyan-600 size-6" />,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-cyan-600 text-white text-center py-1 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span>Live on EDU Chain Testnet</span>
      </div>
      <header className="flex justify-between items-center p-4 border-b">
        <img src="/logo.png" alt="EduStreamr" className="w-24" />
        <div className="flex gap-4">
          <Link
            href="https://github.com/cvpfus/edu-streamr"
            className="hover:opacity-80"
            target="_blank"
          >
            <GitHubIcon />
          </Link>
          <Link
            href="https://x.com/EduStreamr"
            className="hover:opacity-80"
            target="_blank"
          >
            <XIcon />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-12 items-center px-8 mt-8">
        <div className="flex flex-col gap-6 items-center justify-center text-center">
          <p className="text-cyan-600 font-bold">
            Web3 Monetization for Educators / Content Creators
          </p>
          <h1 className="text-5xl font-bold">
            Unlock Web3 Monetization with{" "}
            <span className="text-cyan-600">EduStreamr</span>
          </h1>
          <p className="text-gray-600 max-w-2xl">
            The first decentralized platform that enables educators and content
            creators to monetize their live streams through Web3 technology.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg">Launch App</Button>
            </Link>
            <Link href="https://docs.edustreamr.xyz" target="_blank">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white w-full max-w-7xl rounded-xl">
          <div className="w-full max-w-7xl flex gap-4 flex-col sm:flex-row items-center justify-around p-8 bg-gradient-to-br from-cyan-100/70 to-fuchsia-100/70 backdrop-blur-sm shadow-sm border border-gray-200 text-cyan-600 [&_p]:text-gray-600 rounded-xl text-center">
            <div>
              <h2 className="text-3xl font-bold">X</h2>
              <p>Streamers Onboarded</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">X</h2>
              <p>Tip Count</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">X</h2>
              <p>Total Streamers' Earnings</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl flex flex-col gap-6 items-center justify-center">
          <h2 className="text-3xl font-bold text-center">
            Why choose <span className="text-cyan-600">EduStreamr?</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {opportunities.map((opportunity, index) => {
              return (
                <Card key={index} className="flex gap-4">
                  <CardContent className="pt-6 flex flex-col gap-2">
                    {opportunity.icon}
                    <h3 className="text-xl font-bold text-cyan-600">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 text-justify">
                      {opportunity.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EduStreamr. All rights reserved.
      </footer>
    </div>
  );
}
