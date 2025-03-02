import { type ReactNode, useState, createContext } from "react";

export const ColorContext = createContext<{
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}>({
  primaryColor: "",
  secondaryColor: "",
  backgroundColor: "",
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  setBackgroundColor: () => {},
});

// TODO: Prevent unnecessary re-renders
export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  const value = {
    primaryColor,
    secondaryColor,
    backgroundColor,
    setPrimaryColor,
    setSecondaryColor,
    setBackgroundColor,
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};
