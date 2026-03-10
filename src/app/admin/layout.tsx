"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/src/components/layout/admin-shell";
import { useAuth } from "@/src/features/auth/context/auth-context";

function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, isLoading, router]);

  if (!isHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
