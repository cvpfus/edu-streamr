import { ColorContext } from "@/components/color-provider";
import { useContext } from "react";

export const useColor = () => {
  return useContext(ColorContext);
};
