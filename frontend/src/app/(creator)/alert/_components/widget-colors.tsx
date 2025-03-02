import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/use-color";
import { useWriteContract } from "wagmi";
import { EduStreamrAbi } from "@/abi/EduStreamr";
import { useMemo, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmi";
import toast from "react-hot-toast";
import { TestAlert } from "./test-alert";
import { Loader2, Save } from "lucide-react";

interface WidgetColorsProps {
  contractAddress: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export const WidgetColors = ({
  contractAddress,
  colors,
}: WidgetColorsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { primaryColor, secondaryColor, backgroundColor } = useColor();

  const { writeContract } = useWriteContract();

  const handleSaveColors = () => {
    setIsLoading(true);

    writeContract(
      {
        abi: EduStreamrAbi,
        address: contractAddress,
        functionName: "setColors",
        args: [primaryColor, secondaryColor, backgroundColor],
      },
      {
        onSettled: () => {
          setIsLoading(false);
        },
        onSuccess: async (data) => {
          await waitForTransactionReceipt(config, {
            hash: data,
          });

          toast.success("Colors saved successfully");
        },
        onError: (error) => {
          toast.error("Failed to save colors. See console for detailed error.");

          console.error(error);
        },
      }
    );
  };

  const realtimeColors = useMemo(
    () => ({
      primary: primaryColor ? primaryColor : colors.primary,
      secondary: secondaryColor ? secondaryColor : colors.secondary,
      background: backgroundColor ? backgroundColor : colors.background,
    }),
    [primaryColor, secondaryColor, backgroundColor]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget colors</CardTitle>
        <CardDescription>
          Change widget colors based on your preference. This action requires a
          small transaction fee (~0.0001 EDU).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <TestAlert colors={realtimeColors} />
          <ColorPicker
            initialColor={colors.primary}
            title="Primary Color"
            description="The primary color for your alert."
            type="primary"
          />
          <ColorPicker
            initialColor={colors.secondary}
            title="Secondary Color"
            description="The secondary color for your alert."
            type="secondary"
          />
          <ColorPicker
            initialColor={colors.background}
            title="Background Color"
            description="The background color for your alert."
            type="background"
          />
        </div>
        <Button
          onClick={handleSaveColors}
          disabled={isLoading}
          className="self-start flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
          <span>Save</span>
        </Button>
      </CardContent>
    </Card>
  );
};
