"use client";

import { Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/features/auth/context/auth-context";

type AdminHeaderProps = {
  onOpenSidebar: () => void;
};

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const { user } = useAuth();
  const displayName = user?.name?.trim() || user?.email?.trim() || "Administrador";
  const displayEmail = user?.email?.trim() || "";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="p-2 md:hidden"
            onClick={onOpenSidebar}
            aria-label="Abrir navegación"
          >
            <Menu className="size-5" />
          </Button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Panel de administración
            </p>
            <p className="text-sm font-semibold text-slate-900">Tennjor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">{displayEmail || "Sin correo disponible"}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
