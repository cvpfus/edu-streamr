import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { config as wagmiConfig } from "@/wagmi";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduStreamr",
};

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    (await headers()).get("cookie")
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-right" />
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
    </html>
  );
}