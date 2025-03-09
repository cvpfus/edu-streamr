import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { headers } from "next/headers";
import { RequestButton } from "./_components/request-button";

export const metadata: Metadata = {
  title: "Faucet",
};

export default async function FaucetPage() {
  const head = await headers();
  const host = head.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="py-4">
      <Card>
        <CardHeader>
          <CardTitle>Faucet</CardTitle>
          <CardDescription>
            Request 0.01 EDU to interact with the platform. You can only request
            once and must log in with Google or email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestButton baseUrl={baseUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
