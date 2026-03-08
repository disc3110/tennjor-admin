"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AdminHeader } from "@/src/components/layout/admin-header";
import { AdminSidebar } from "@/src/components/layout/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
