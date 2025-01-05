import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyButton({
  text,
  disabled,
}: {
  text: string;
  disabled?: boolean;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (_error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      <Copy />
      <span>Copy</span>
    </Button>
  );
}
