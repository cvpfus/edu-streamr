import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CopyButton from "@/components/ui/copy-button";
import React from "react";
import Link from "next/link";

export const AlertUrl = ({
  fullUrl,
  username,
}: {
  fullUrl: string;
  username?: string;
}) => {
  const obsUrl = `${fullUrl}?layer-name=EduStreamr Alert&layer-width=600&layer-height=200`;

  const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
    const exampleAlert = document.getElementById("example-alert");

    if (exampleAlert) {
      e.dataTransfer.setDragImage(exampleAlert, 0, 0);
    } else {
      const img = document.createElement("img");
      img.setAttribute("src", "/logo.png");
      img.setAttribute("alt", "EduStreamr");
      img.id = "edustreamr-logo";
      img.hidden = true;
      document.body.appendChild(img);
      e.dataTransfer.setDragImage(img, 0, 0);
    }

    e.dataTransfer.setData("text/uri-list", obsUrl);
  };

  const handleDragEnd = () => {
    const img = document.getElementById("edustreamr-logo");

    if (img) {
      document.body.removeChild(img);
    }
  };

  return (
    <Link
      href={obsUrl}
      onClick={(e) => e.preventDefault()}
      className="cursor-default w-full"
      onDragStartCapture={handleDragStart}
      onDragEndCapture={handleDragEnd}
      draggable
    >
      <Card className="w-full flex flex-col">
        <CardHeader>
          <CardTitle>Alert URL</CardTitle>
          <CardDescription>
            Copy this URL and paste it into the OBS Browser Source. Or, simply
            drag and drop this box into OBS to create the source instantly.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-grow flex items-end">
          <div className="flex gap-4 w-full">
            <Input value={fullUrl} readOnly />
            <CopyButton text={fullUrl} disabled={!username} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
