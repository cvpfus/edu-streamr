import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { BellRing, LayoutDashboard, ScrollText, Settings } from "lucide-react";

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
    <>
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
    </>
  );
}
