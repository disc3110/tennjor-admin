"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Shapes, MessageSquareQuote, LogOut, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Shapes },
  { label: "Quotes", href: "/admin/quotes", icon: MessageSquareQuote },
] as const;

export function AdminSidebar({ isOpen, onClose, onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-4 transition-transform md:static md:z-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tennjor</p>
            <p className="text-lg font-semibold text-slate-900">Admin</p>
          </div>
          <Button
            variant="ghost"
            className="p-2 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Button variant="ghost" className="justify-start gap-3 text-slate-600" onClick={onSignOut}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </aside>
    </>
  );
}
