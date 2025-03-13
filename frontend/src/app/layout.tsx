import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { config as wagmiConfig } from "@/wagmi";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const font = Inter({ subsets: ["latin"], style: ["normal", "italic"] });

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
      <body className={`${font.className} antialiased`}>
        <Toaster position="top-right" />
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
