"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder only: real auth flow will be implemented later.
    console.info("Login placeholder", { email, passwordLength: password.length });
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-lg">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Tennjor Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-500">
          Use your admin credentials to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="email"
              placeholder="admin@tennjor.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-10"
              required
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10"
              required
            />
          </div>
        </label>

        <Button type="submit" className="mt-2 h-11 w-full">
          Sign in
        </Button>
      </form>
    </Card>
  );
}
