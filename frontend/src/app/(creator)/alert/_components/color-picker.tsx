import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  hexToHsva,
  type HsvaColor,
  hsvaToHex,
  Saturation,
} from "@uiw/react-color";
import { useState } from "react";
import { useColor } from "@/hooks/use-color";
import { Slider } from "@/components/ui/slider";

interface ColorPickerProps {
  initialColor: string;
  title: string;
  description: string;
  type: "primary" | "secondary" | "background";
}

export const ColorPicker = ({
  initialColor,
  title,
  description,
  type,
}: ColorPickerProps) => {
  const [hsva, setHsva] = useState(hexToHsva(initialColor));

  const { setPrimaryColor, setSecondaryColor, setBackgroundColor } = useColor();

  const handleColor = (hex: string) => {
    if (type === "primary") {
      setPrimaryColor(hex);
    }
    if (type === "secondary") {
      setSecondaryColor(hex);
    }
    if (type === "background") {
      setBackgroundColor(hex);
    }
  };

  const handleSaturationChange = (newColor: HsvaColor) => {
    const hex = hsvaToHex(newColor);

    handleColor(hex);

    setHsva(newColor);
  };

  const handleHueChange = (newValue: number[]) => {
    const hex = hsvaToHex({ ...hsva, h: newValue[0] });
    handleColor(hex);
    setHsva({ ...hsva, h: newValue[0] });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="noShadow"
              className="max-w-[240px] bg-white w-full justify-start text-left font-normal"
            >
              <div className="w-full flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded !bg-center !bg-cover transition-all border"
                  style={{
                    backgroundColor: `${hsvaToHex(hsva)}`,
                  }}
                />
                <div className="truncate flex-1">{hsvaToHex(hsva)}</div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full bg-white">
            <div className="grid gap-4">
              <Saturation hsva={hsva} onChange={handleSaturationChange} />
              <Slider
                value={[hsva.h]}
                onValueChange={handleHueChange}
                max={360}
                step={1}
                className="[&_.bg-main]:bg-transparent [&_.bg-bw]:bg-transparent h-2"
                style={{
                  backgroundImage: `linear-gradient(to right, 
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%)
                  )`,
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};
