import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  BellRing,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  ScrollText,
  Settings,
} from "lucide-react";

const NavItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    href: "/history",
    label: "Tip History",
    icon: <ScrollText className="size-4" />,
  },
  {
    href: "/alert",
    label: "Alert",
    icon: <BellRing className="size-4" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="size-4" />,
  },
];

export default function SideNavItems() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4">
        {NavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              className="w-full sm:w-48 flex items-center justify-start gap-2"
              variant={pathname === item.href ? "default" : "secondary"}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Link href="https://feedback.edustreamr.xyz" target="_blank" className="mb-0 sm:mb-2">
          <Button className="w-full sm:w-48 flex items-center justify-start gap-2">
            <MessageSquareText />
            <span className="hidden sm:block">Feedback</span>
          </Button>
        </Link>
        <Link href="https://docs.edustreamr.xyz" target="_blank" className="mb-0 sm:mb-2">
          <Button className="w-full sm:w-48 flex items-center justify-start gap-2">
            <FileText />
            <span className="hidden sm:block">Docs</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
