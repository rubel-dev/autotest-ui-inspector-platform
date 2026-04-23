"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rubel@example.com");
  const [password, setPassword] = useState("DemoPass123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await api.login({ email, password });
      saveSession(auth);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Sign in to review projects, inspect captured UI elements, and monitor automated test quality."
      switchLabel="New to AutoTest?"
      switchHref="/register"
      switchText="Create an account"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail className="h-4 w-4" /> Email
          </span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Lock className="h-4 w-4" /> Password
          </span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthPanel>
  );
}
