import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";

export const PrimaryColor = ({ currentColor }: { currentColor: string }) => {
  const [color, setColor] = useState(currentColor);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Primary Color</CardTitle>
        <CardDescription>The primary color for your alert.</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};
