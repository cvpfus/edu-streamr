import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Metadata } from "next";
import Bio from "./_components/bio";
import { headers } from "next/headers";
import Alert from "./_components/alert";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const head = await headers();
  const host = head.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Settings</div>
      <Card>
        <CardHeader>
          <CardTitle>Alert URL</CardTitle>
          <CardDescription>
            Copy this URL and paste it to the OBS Browser Source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert baseUrl={baseUrl} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Set Bio</CardTitle>
          <CardDescription>
            Set your bio to be displayed on the tip page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Bio />
        </CardContent>
      </Card>
    </div>
  );
}
