import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200",
        className,
      )}
      {...props}
    />
  );
}
