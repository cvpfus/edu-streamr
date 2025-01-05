import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "Unlock",
  },
  {
    text: "Web3",
  },
  {
    text: "Monetization",
  },
  {
    text: "with",
  },
  {
    text: "EduStreamr",
    className: "text-cyan-600",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-cyan-600 text-white text-center py-1 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span>Live on EduChain Testnet</span>
      </div>
      <header className="flex justify-between items-center p-4 border-b">
        <img src="/logo.png" alt="EduStreamr" className="w-24" />
        <div className="flex gap-4">
          <Link
            href="https://github.com/cvpfus/edu-streamr"
            className="hover:opacity-80"
            target="_blank"
          >
            <SiGithub className="w-6 h-6 text-cyan-600" />
          </Link>
          <Link
            href="https://x.com/EduStreamr"
            className="hover:opacity-80"
            target="_blank"
          >
            <SiX className="w-6 h-6 text-cyan-600" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-12 items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center">
          <TypewriterEffectSmooth words={words} />
          <Link href="/dashboard">
            <Button size="lg">Launch App</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-cyan-600 mb-4">
              Decentralized Live Q&A Sessions
            </h3>
            <p className="text-sm">
              Streamers can set up live Q&A sessions with EduStreamr platform
              and get questions from their audience via tips.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-cyan-600 mb-4">
              Seamless Integration for Streamers
            </h3>
            <p className="text-sm">
              Streamers can easily integrate EduStreamr into their existing
              setup. The platform is designed to be simple for all content
              creators.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-cyan-600 mb-4">Web3-first</h3>
            <p className="text-sm">
              Built with Web3 principles, streamers own their payment channels.
              No middlemen, ensuring direct control over revenue generation.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EduStreamr. All rights reserved.
      </footer>
    </div>
  );
}
