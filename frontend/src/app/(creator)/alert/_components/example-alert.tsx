import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExampleAlertProps {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const ExampleAlert = ({ colors }: ExampleAlertProps) => {
  return (
    <Card
      className="w-full text-center"
      style={{ backgroundColor: colors.background }}
      id="example-alert"
    >
      <CardHeader>
        <CardTitle className="font-normal">
          <span className="font-medium" style={{ color: colors.secondary }}>
            EduStreamr{" "}
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
