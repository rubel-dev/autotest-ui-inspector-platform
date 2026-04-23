"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, UserRound } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register({ name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel
      title="Create your workspace"
      subtitle="Start a focused UI quality workspace with projects, inspection history, test cases, logs, and analytics."
      switchLabel="Already have an account?"
      switchHref="/login"
      switchText="Sign in"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <UserRound className="h-4 w-4" /> Name
          </span>
          <Input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail className="h-4 w-4" /> Email
          </span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-2 text-sm font-semibold text-slate-700">Password</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthPanel>
  );
}
