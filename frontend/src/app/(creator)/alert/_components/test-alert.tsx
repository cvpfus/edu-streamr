import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { color } from "framer-motion";

interface TestAlertProps {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const TestAlert = ({ colors }: TestAlertProps) => {
  return (
    <Card
      className="w-full text-center"
      style={{ backgroundColor: colors.background }}
    >
      <CardHeader>
        <CardTitle className="font-normal">
          <span className="font-medium" style={{ color: colors.secondary }}>
            Anonymous{" "}
          </span>
          <span style={{ color: colors.primary }}>tipped </span>
          <span className="font-medium" style={{ color: colors.secondary }}>
            10 EDU
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm" style={{ color: colors.primary }}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque possimus
        dignissimos repudiandae unde autem eius inventore cumque.
      </CardContent>
    </Card>
  );
};
