import { Button } from "@/components/ui/button";
import { EXPLORER_TX_BASE_URL } from "@/constants";
import { cn } from "@/lib/utils";
import { Loader2, LucideIcon } from "lucide-react";
import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  txHash: string | undefined;
  icon: LucideIcon;
  text: string;
}

export const TxButton = ({
  isLoading,
  txHash,
  icon: Icon,
  text,
  className,
  ...props
}: ButtonProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        type="submit"
        disabled={isLoading}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Icon />}
        <span>{text}</span>
      </Button>
      {txHash ? (
        <Link
          href={`${EXPLORER_TX_BASE_URL}/${txHash}`}
          className="underline text-xs"
          target="blank"
        >
          Success! Click here to view the transaction.
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};
