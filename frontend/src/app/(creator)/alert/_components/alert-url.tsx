import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CopyButton from "@/components/ui/copy-button";

export const AlertUrl = ({
  fullUrl,
  username,
}: {
  fullUrl: string;
  username?: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert URL</CardTitle>
        <CardDescription>
          Copy this URL and paste it to the OBS Browser Source.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-4">
          <Input value={fullUrl} readOnly />
          <CopyButton text={fullUrl} disabled={!username} />
        </div>
      </CardContent>
    </Card>
  );
};
