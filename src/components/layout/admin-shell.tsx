"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/src/components/layout/admin-header";
import { AdminSidebar } from "@/src/components/layout/admin-sidebar";
import { useAuth } from "@/src/features/auth/context/auth-context";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSignOut={handleSignOut}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
