"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Laptop } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Laptop },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-semibold text-foreground">Asset Manager</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          // Dashboard ("/") should only be "active" on an exact match,
          // otherwise it would stay highlighted while browsing /assets too.
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-background hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border text-xs text-muted">
        IT Asset Tracking &middot; v1.0
      </div>
    </aside>
  );
}
